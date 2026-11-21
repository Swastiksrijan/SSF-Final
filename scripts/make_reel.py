#!/usr/bin/env python3
"""Turn a published post's poster image into a 9:16 reel (MP4).

Free and key-less on purpose:
  * ffmpeg does the video (pre-installed on GitHub's ubuntu runners),
  * edge-tts (Microsoft Edge read-aloud voices) does the Hindi narration,
    with gTTS as a fallback and a silent reel if neither is reachable.

The poster PNG/JPEG is reused as-is instead of re-drawing text, because the
backend already rasterized the Devanagari headline with Skia. Drawing Hindi with
ffmpeg's drawtext mangles the conjuncts, so the reel is a motion treatment of a
correct image: blurred full-bleed backdrop + the poster card with a slow zoom.

Usage:
  python3 scripts/make_reel.py --image post.jpg --out reel.mp4 \
      --text-file narration.txt [--voice hi-IN-SwaraNeural] [--no-voice]
"""

import argparse
import asyncio
import json
import os
import shutil
import subprocess
import sys
import tempfile

W, H = 1080, 1920
FPS = 30
MIN_SECONDS, MAX_SECONDS = 8.0, 45.0
DEFAULT_VOICE = 'hi-IN-SwaraNeural'


def ffmpeg_bin():
    """Prefer a real ffmpeg, fall back to imageio-ffmpeg's bundled static build."""
    override = os.environ.get('FFMPEG_BIN')
    if override:
        return override
    found = shutil.which('ffmpeg')
    if found:
        return found
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        sys.exit('ffmpeg not found. Install it, or pip install imageio-ffmpeg.')


def run(cmd):
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if proc.returncode != 0:
        raise RuntimeError((proc.stderr or '').strip()[-800:] or f'command failed: {cmd[0]}')
    return proc.stdout


MAX_SPOKEN_CHARS = 380  # ~35s of Hindi speech at +8% rate, inside the 45s limit
SPEECH_RATE = '+8%'


def clean_text(raw):
    text = ' '.join(str(raw or '').split())
    # Hashtags and bare links read badly aloud.
    text = ' '.join(w for w in text.split(' ') if not w.startswith('#') and not w.startswith('http'))
    if len(text) <= MAX_SPOKEN_CHARS:
        return text
    cut = text[:MAX_SPOKEN_CHARS]
    # Prefer a sentence boundary so the narration never stops mid-thought.
    for stop in ('।', '?', '!', '.'):
        idx = cut.rfind(stop)
        if idx > MAX_SPOKEN_CHARS * 0.5:
            return cut[:idx + 1]
    return cut.rsplit(' ', 1)[0] + '…'


def synth_edge(text, voice, out_path):
    import edge_tts
    asyncio.run(edge_tts.Communicate(text, voice, rate=SPEECH_RATE).save(out_path))
    return os.path.getsize(out_path) > 1000


def synth_gtts(text, out_path):
    from gtts import gTTS
    gTTS(text=text, lang='hi').save(out_path)
    return os.path.getsize(out_path) > 1000


def make_voice(text, voice, out_path):
    """Try edge-tts, then gTTS. Returns True when an audio file was produced."""
    if not text:
        return False
    for name, fn in (('edge-tts', lambda: synth_edge(text, voice, out_path)),
                     ('gTTS', lambda: synth_gtts(text, out_path))):
        try:
            if fn():
                print(f'voice: {name}', file=sys.stderr)
                return True
        except Exception as exc:  # network/voice/package problems are non-fatal
            print(f'voice: {name} failed ({exc})', file=sys.stderr)
    return False


def audio_seconds(ffmpeg, path):
    ffprobe = os.path.join(os.path.dirname(ffmpeg), 'ffprobe')
    probe = shutil.which('ffprobe') or (ffprobe if os.path.exists(ffprobe) else None)
    if probe:
        try:
            out = run([probe, '-v', 'error', '-show_entries', 'format=duration',
                       '-of', 'default=nw=1:nk=1', path])
            return float(out.strip())
        except Exception:
            pass
    # Fallback: decode to null and read the reported time from ffmpeg's log.
    proc = subprocess.run([ffmpeg, '-hide_banner', '-i', path, '-f', 'null', '-'],
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    for line in (proc.stderr or '').splitlines():
        if 'time=' in line:
            stamp = line.split('time=')[1].split(' ')[0]
            hh, mm, ss = stamp.split(':')
            return int(hh) * 3600 + int(mm) * 60 + float(ss)
    return 0.0


def build(ffmpeg, image, out_path, seconds, voice_path):
    fade_out = max(0.0, seconds - 0.8)
    zoom = f"zoompan=z='min(1.07,1+0.0008*on)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={W}x{W}:fps={FPS}"
    graph = (
        f'[0:v]split=2[bg0][fg0];'
        f'[bg0]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},'
        f'gblur=sigma=40,eq=brightness=-0.26:saturation=1.12[bg];'
        f'[fg0]scale={W}:{W},{zoom},format=yuva420p,'
        f'fade=t=in:st=0:d=0.7:alpha=1[fg];'
        f'[bg][fg]overlay=(W-w)/2:(H-h)/2[v0];'
        f'[v0]fade=t=out:st={fade_out:.2f}:d=0.8,format=yuv420p[v]'
    )
    cmd = [ffmpeg, '-y', '-hide_banner', '-loglevel', 'error',
           '-loop', '1', '-framerate', str(FPS), '-t', f'{seconds:.2f}', '-i', image]
    if voice_path:
        cmd += ['-i', voice_path]
        graph += f';[1:a]adelay=400|400,apad=pad_dur={seconds:.2f},atrim=0:{seconds:.2f},volume=1.0[a]'
    else:
        cmd += ['-f', 'lavfi', '-i', f'anullsrc=r=44100:cl=stereo:d={seconds:.2f}']
        graph += f';[1:a]atrim=0:{seconds:.2f}[a]'
    cmd += ['-filter_complex', graph, '-map', '[v]', '-map', '[a]',
            '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', '-pix_fmt', 'yuv420p',
            '-profile:v', 'high', '-level', '4.0', '-r', str(FPS),
            '-c:a', 'aac', '-b:a', '128k', '-ar', '44100', '-ac', '2',
            '-movflags', '+faststart', '-t', f'{seconds:.2f}', out_path]
    run(cmd)


def main():
    ap = argparse.ArgumentParser(description='Render a post poster into a 9:16 reel.')
    ap.add_argument('--image', required=True, help='poster PNG/JPEG (1080x1080 expected)')
    ap.add_argument('--out', required=True, help='output .mp4')
    ap.add_argument('--text', default='', help='narration text')
    ap.add_argument('--text-file', default='', help='file containing narration text')
    ap.add_argument('--voice', default=os.environ.get('REEL_VOICE', DEFAULT_VOICE))
    ap.add_argument('--seconds', type=float, default=0, help='clip length (default: from narration)')
    ap.add_argument('--no-voice', action='store_true', help='render without narration')
    args = ap.parse_args()

    text = clean_text(args.text)
    if args.text_file and os.path.exists(args.text_file):
        with open(args.text_file, encoding='utf-8') as fh:
            text = clean_text(fh.read())

    ffmpeg = ffmpeg_bin()
    if not os.path.exists(args.image):
        sys.exit(f'image not found: {args.image}')

    tmp = tempfile.mkdtemp(prefix='reel-')
    voice_path = os.path.join(tmp, 'voice.mp3')
    spoken = False if args.no_voice else make_voice(text, args.voice, voice_path)

    if args.seconds > 0:
        seconds = args.seconds
    elif spoken:
        seconds = audio_seconds(ffmpeg, voice_path) + 1.2
    else:
        seconds = 12.0
    seconds = round(min(MAX_SECONDS, max(MIN_SECONDS, seconds)), 2)

    os.makedirs(os.path.dirname(os.path.abspath(args.out)) or '.', exist_ok=True)
    build(ffmpeg, args.image, args.out, seconds, voice_path if spoken else None)

    shutil.rmtree(tmp, ignore_errors=True)
    print(json.dumps({
        'ok': True, 'out': os.path.abspath(args.out), 'seconds': seconds,
        'voice': spoken, 'bytes': os.path.getsize(args.out),
    }))


if __name__ == '__main__':
    main()
