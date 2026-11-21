#!/usr/bin/env python3
"""Turn a published post's poster into a 9:16 reel (1080x1920 MP4).

Free and key-less on purpose:
  * ffmpeg does the video (pre-installed on GitHub's ubuntu runners),
  * Pillow (with Raqm) draws the hook and end cards, so Hindi shapes correctly,
  * edge-tts (Microsoft Edge read-aloud voices) does the Hindi narration, with
    gTTS as a fallback and a silent reel if neither is reachable,
  * the music bed is synthesised by ffmpeg, so there is no copyright to worry
    about and no asset to ship.

The poster is reused as-is instead of re-drawing the body text, because the
backend already rasterized the Devanagari headline with Skia; ffmpeg's drawtext
mangles Hindi conjuncts.

Reel shape:
  0.0s              hook card  - the bilingual message, so the first two seconds land
  2.6s              poster     - the published poster, slow zoom, Hindi narration
  narration end     end card   - donate: QR, UPI/Paytm number, website

Usage:
  python3 scripts/make_reel.py --image post.jpg --out reel.mp4 \
      --title-en "..." --title-hi "..." --text-file narration.txt
"""

import argparse
import asyncio
import json
import os
import shutil
import subprocess
import sys
import tempfile

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1080, 1920
FPS = 30
HOOK_SECONDS = 2.6
END_SECONDS = 5.0
MIN_BODY, MAX_BODY = 6.0, 45.0
MAX_SPOKEN_CHARS = 380  # ~35s of Hindi speech at +8% rate
SPEECH_RATE = '+8%'
DEFAULT_VOICE = 'hi-IN-SwaraNeural'

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT_DIRS = [d for d in (os.environ.get('REEL_FONT_DIR'),
                         os.path.join(ROOT, 'backend_node', 'assets', 'fonts'),
                         '/usr/share/fonts/truetype/noto') if d]
LOGO = os.path.join(ROOT, 'backend_node', 'assets', 'social-logo.png')

NAVY = (0, 35, 68)
NAVY_LIGHT = (16, 58, 100)
GOLD = (214, 181, 109)
GOLD_BRIGHT = (255, 209, 102)
WHITE = (255, 255, 255)
SITE = 'swastiksrijan.in'
DONATE_URL = 'https://swastiksrijan.in/Donate'
UPI_ID = '9718346691'


def _is_font(path):
    """Guard against the repo's checked-in .ttf files being HTML error pages."""
    try:
        with open(path, 'rb') as fh:
            magic = fh.read(4)
        return magic in (b'\x00\x01\x00\x00', b'true', b'OTTO', b'ttcf')
    except OSError:
        return False


def font(name, size):
    for folder in FONT_DIRS:
        path = os.path.join(folder, name)
        if _is_font(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default(size)


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


# ---- narration -------------------------------------------------------------

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
        except Exception as exc:  # a network or package problem must not block the reel
            print(f'voice: {name} failed ({exc})', file=sys.stderr)
    return False


def audio_seconds(ffmpeg, path):
    probe = shutil.which('ffprobe')
    if probe:
        try:
            out = run([probe, '-v', 'error', '-show_entries', 'format=duration',
                       '-of', 'default=nw=1:nk=1', path])
            return float(out.strip())
        except Exception:
            pass
    # No ffprobe: decode to null and read the time ffmpeg reports.
    proc = subprocess.run([ffmpeg, '-hide_banner', '-i', path, '-f', 'null', '-'],
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    for line in (proc.stderr or '').splitlines():
        if 'time=' in line:
            hh, mm, ss = line.split('time=')[1].split(' ')[0].split(':')
            return int(hh) * 3600 + int(mm) * 60 + float(ss)
    return 0.0


# ---- cards -----------------------------------------------------------------

def gradient(w, h, top, bottom):
    img = Image.new('RGB', (w, h))
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(1, h - 1)
        d.line([(0, y), (w, y)], fill=tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return img


def glow(img, cx, cy, r, colour, alpha=70):
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse([cx - r, cy - r, cx + r, cy + r], fill=colour + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(r / 2))
    return Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')


def paste_logo(img, x, y, size):
    if not os.path.exists(LOGO):
        return
    logo = Image.open(LOGO).convert('RGBA').resize((size, size), Image.LANCZOS)
    img.paste(logo, (x, y), logo)


def wrap(draw, text, fnt, max_width, limit=None):
    lines, line = [], ''
    for word in str(text or '').split():
        trial = f'{line} {word}'.strip()
        if draw.textlength(trial, font=fnt) <= max_width or not line:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines[:limit] if limit else lines


def draw_lines(draw, lines, x, y, fnt, fill, leading):
    for ln in lines:
        draw.text((x, y), ln, font=fnt, fill=fill)
        y += leading
    return y


def brand_bar(img, draw):
    """Small SSF lockup used at the top of the hook card."""
    paste_logo(img, 70, 70, 104)
    draw.text((196, 82), 'Swastik Srijan Foundation', font=font('NotoSans-Bold.ttf', 40), fill=WHITE)
    draw.text((196, 132), 'स्वास्तिक सृजन फाउंडेशन',
              font=font('NotoSansDevanagari-Regular.ttf', 30), fill=(210, 226, 240))
    draw.line([(70, 210), (W - 70, 210)], fill=GOLD, width=2)


def hook_card(post, out_path):
    """First ~2.6s: the message itself, big and bilingual."""
    img = glow(gradient(W, H, NAVY, NAVY_LIGHT), W - 120, H - 420, 460, GOLD, 60)
    d = ImageDraw.Draw(img)
    brand_bar(img, d)

    f_eyebrow = font('NotoSansDevanagari-Bold.ttf', 44)
    f_kicker = font('NotoSans-Bold.ttf', 30)
    f_en = font('NotoSans-Bold.ttf', 78)
    f_hi = font('NotoSansDevanagari-Bold.ttf', 64)
    en_lines = wrap(d, post.get('titleEn'), f_en, W - 160, 3)
    hi_lines = wrap(d, post.get('titleHi'), f_hi, W - 160, 3)

    # Centre the block between the brand bar and the footer instead of leaving
    # the lower half of the frame empty.
    block = 70 + len(en_lines) * 92 + 40 + 12 + 60 + len(hi_lines) * 80
    y = 250 + max(0, (H - 300 - 250 - block) / 2)

    d.text((80, y), 'आज की बात', font=f_eyebrow, fill=GOLD_BRIGHT)
    d.text((80, y + 62), "TODAY'S MESSAGE", font=f_kicker, fill=(180, 200, 220))
    y += 140
    y = draw_lines(d, en_lines, 80, y, f_en, WHITE, 92) + 40
    d.rectangle([80, y, 240, y + 12], fill=GOLD)
    y += 72
    draw_lines(d, hi_lines, 80, y, f_hi, GOLD_BRIGHT, 80)

    d.text((80, H - 210), 'Swastik Srijan Foundation', font=font('NotoSans-Bold.ttf', 34), fill=WHITE)
    d.text((80, H - 158), SITE, font=font('NotoSans-Regular.ttf', 32), fill=(200, 216, 232))
    img.save(out_path)


def qr_image(url, size):
    """QR for the donate page. None when the qrcode package is not installed."""
    try:
        import qrcode
    except ImportError:
        return None
    qr = qrcode.QRCode(border=2, box_size=10, error_correction=qrcode.constants.ERROR_CORRECT_M)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color='#002344', back_color='white').convert('RGB')
    # NEAREST keeps the modules square; LANCZOS blurs them into an unscannable mess.
    return img.resize((size, size), Image.NEAREST)


def end_card(out_path):
    """Last seconds: the ask. QR, UPI number and the donate page, every reel."""
    img = glow(gradient(W, H, NAVY_LIGHT, NAVY), W // 2, 860, 560, GOLD, 50)
    d = ImageDraw.Draw(img)

    def centre(text, fnt, y, fill):
        d.text(((W - d.textlength(text, font=fnt)) / 2, y), text, font=fnt, fill=fill)

    def centre_mixed(parts, y):
        """Latin and Devanagari need different fonts; Devanagari fonts have no 'S'."""
        widths = [d.textlength(t, font=f) for t, f, _ in parts]
        x = (W - sum(widths)) / 2
        for (text, fnt, fill), width in zip(parts, widths):
            d.text((x, y), text, font=fnt, fill=fill)
            x += width

    paste_logo(img, W // 2 - 92, 120, 184)

    centre('DONATE NOW', font('NotoSans-Bold.ttf', 92), 350, GOLD_BRIGHT)
    centre('अभी दान करें', font('NotoSansDevanagari-Bold.ttf', 58), 470, WHITE)

    box, pad = 420, 22
    x0, y0 = (W - box) // 2, 590
    d.rounded_rectangle([x0, y0, x0 + box, y0 + box], radius=28, fill=WHITE)
    qr = qr_image(DONATE_URL, box - pad * 2)
    if qr is not None:
        img.paste(qr, (x0 + pad, y0 + pad))
    else:
        centre('QR', font('NotoSans-Bold.ttf', 120), y0 + 130, NAVY)

    # "QR" must come from the Latin face: the Devanagari subset has no Q or R.
    centre_mixed([('QR', font('NotoSans-Bold.ttf', 34), (206, 222, 238)),
                  (' स्कैन करें', font('NotoSansDevanagari-Regular.ttf', 34), (206, 222, 238)),
                  ('  •  Scan to donate', font('NotoSans-Regular.ttf', 34), (206, 222, 238))], y0 + box + 26)

    d.line([(W // 2 - 150, y0 + box + 96), (W // 2 + 150, y0 + box + 96)], fill=GOLD, width=3)
    centre_mixed([('UPI / Paytm  ', font('NotoSans-Regular.ttf', 40), (200, 216, 232)),
                  (UPI_ID, font('NotoSans-Bold.ttf', 54), WHITE)], y0 + box + 126)
    centre(SITE + '/Donate', font('NotoSans-Bold.ttf', 56), y0 + box + 216, GOLD_BRIGHT)
    centre('@swastiksrijan  •  Join Us', font('NotoSans-Regular.ttf', 36), y0 + box + 300, (200, 216, 232))

    centre('हर मदद मायने रखती है', font('NotoSansDevanagari-Bold.ttf', 46), y0 + box + 372, GOLD)
    centre('Every bit of help counts', font('NotoSans-Regular.ttf', 32), y0 + box + 434, (200, 216, 232))

    centre('स्वास्तिक सृजन फाउंडेशन', font('NotoSansDevanagari-Regular.ttf', 34), H - 150, (170, 190, 210))
    centre('Creating Change. Inspiring Lives.', font('NotoSans-Regular.ttf', 30), H - 100, (150, 172, 196))
    img.save(out_path)


# ---- video -----------------------------------------------------------------

def segment(ffmpeg, image, out_path, seconds, zoom=True):
    """One still image -> a short silent clip with a slow zoom and soft fades."""
    fade = 0.45
    if zoom:
        vf = (f"zoompan=z='min(1.07,1+0.0008*on)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
              f":d=1:s={W}x{H}:fps={FPS},format=yuv420p")
    else:
        vf = f'scale={W}:{H},format=yuv420p'
    vf += f",fade=t=in:st=0:d={fade},fade=t=out:st={max(0.0, seconds - fade):.2f}:d={fade}"
    run([ffmpeg, '-y', '-hide_banner', '-loglevel', 'error',
         '-loop', '1', '-framerate', str(FPS), '-t', f'{seconds:.2f}', '-i', image,
         '-vf', vf, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21',
         '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.0',
         '-r', str(FPS), '-g', str(FPS * 2), out_path])


def poster_segment(ffmpeg, image, out_path, seconds):
    """The published poster over a blurred full-bleed backdrop (9:16 safe)."""
    graph = (
        f'[0:v]split=2[bg0][fg0];'
        f'[bg0]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},'
        f'gblur=sigma=40,eq=brightness=-0.26:saturation=1.12[bg];'
        f'[fg0]scale={W}:{W},'
        f"zoompan=z='min(1.07,1+0.0008*on)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={W}x{W}:fps={FPS},"
        f'format=yuva420p[fg];'
        f'[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p[v]'
    )
    run([ffmpeg, '-y', '-hide_banner', '-loglevel', 'error',
         '-loop', '1', '-framerate', str(FPS), '-t', f'{seconds:.2f}', '-i', image,
         '-filter_complex', graph, '-map', '[v]',
         '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p',
         '-profile:v', 'high', '-level', '4.0', '-r', str(FPS), '-g', str(FPS * 2), out_path])


def music_source(duration):
    """A soft synthesised pad: no copyright, no asset file, sits under speech."""
    pad = ('0.055*sin(2*PI*220*t)+0.045*sin(2*PI*277.18*t)+0.035*sin(2*PI*329.63*t)'
           '+0.020*sin(2*PI*110*t)')
    swell = '(0.65+0.35*sin(2*PI*0.07*t))'
    return (f"aevalsrc='{pad}*{swell}':s=44100:d={duration:.2f},"
            f"lowpass=f=1800,aecho=0.8:0.55:60|120:0.28|0.18,volume=3.0")


def mux(ffmpeg, video, voice_path, out_path, total, voice_at):
    cmd = [ffmpeg, '-y', '-hide_banner', '-loglevel', 'error', '-i', video]
    graph = []
    if voice_path:
        cmd += ['-i', voice_path]
        delay = int(voice_at * 1000)
        graph.append(f'[1:a]adelay={delay}|{delay},apad=pad_dur={total:.2f},'
                     f'atrim=0:{total:.2f}[voice]')
    cmd += ['-f', 'lavfi', '-i', music_source(total)]
    graph.append(f'[2:a]afade=t=in:st=0:d=1.5,'
                 f'afade=t=out:st={max(0.0, total - 2.0):.2f}:d=2.0[music]')
    if voice_path:
        graph.append('[voice][music]amix=inputs=2:duration=first:dropout_transition=0:weights=1 0.35[a]')
    else:
        graph.append('[music]anull[a]')
    cmd += ['-filter_complex', ';'.join(graph), '-map', '0:v', '-map', '[a]',
            '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-ar', '44100', '-ac', '2',
            '-movflags', '+faststart', '-t', f'{total:.2f}', out_path]
    run(cmd)


def build(ffmpeg, image, out_path, body_seconds, voice_path, post, tmp):
    hook = os.path.join(tmp, 'hook.png')
    end = os.path.join(tmp, 'end.png')
    hook_card(post, hook)
    end_card(end)

    parts = []
    hook_seg = os.path.join(tmp, 'hook.mp4')
    segment(ffmpeg, hook, hook_seg, HOOK_SECONDS, zoom=False)
    parts.append(hook_seg)

    body_seg = os.path.join(tmp, 'body.mp4')
    poster_segment(ffmpeg, image, body_seg, body_seconds)
    parts.append(body_seg)

    end_seg = os.path.join(tmp, 'end.mp4')
    segment(ffmpeg, end, end_seg, END_SECONDS, zoom=True)
    parts.append(end_seg)

    listing = os.path.join(tmp, 'parts.txt')
    with open(listing, 'w', encoding='utf-8') as fh:
        for part in parts:
            fh.write(f"file '{part}'\n")
    joined = os.path.join(tmp, 'joined.mp4')
    run([ffmpeg, '-y', '-hide_banner', '-loglevel', 'error', '-f', 'concat', '-safe', '0',
         '-i', listing, '-c', 'copy', joined])

    total = HOOK_SECONDS + body_seconds + END_SECONDS
    mux(ffmpeg, joined, voice_path, out_path, total, HOOK_SECONDS)
    return total


def main():
    ap = argparse.ArgumentParser(description='Render a post poster into a 9:16 reel.')
    ap.add_argument('--image', required=True, help='poster PNG/JPEG (1080x1080 expected)')
    ap.add_argument('--out', required=True, help='output .mp4')
    ap.add_argument('--title-en', default='')
    ap.add_argument('--title-hi', default='')
    ap.add_argument('--text', default='', help='narration text')
    ap.add_argument('--text-file', default='', help='file containing narration text')
    ap.add_argument('--voice', default=os.environ.get('REEL_VOICE', DEFAULT_VOICE))
    ap.add_argument('--seconds', type=float, default=0, help='body length (default: from narration)')
    ap.add_argument('--no-voice', action='store_true', help='render without narration')
    args = ap.parse_args()

    text = clean_text(args.text)
    if args.text_file and os.path.exists(args.text_file):
        with open(args.text_file, encoding='utf-8') as fh:
            text = clean_text(fh.read())

    post = {'titleEn': args.title_en, 'titleHi': args.title_hi}
    if not post['titleEn'] and not post['titleHi']:
        post['titleEn'] = 'Swastik Srijan Foundation'
        post['titleHi'] = 'स्वास्तिक सृजन फाउंडेशन'

    ffmpeg = ffmpeg_bin()
    if not os.path.exists(args.image):
        sys.exit(f'image not found: {args.image}')

    tmp = tempfile.mkdtemp(prefix='reel-')
    voice_path = os.path.join(tmp, 'voice.mp3')
    spoken = False if args.no_voice else make_voice(text, args.voice, voice_path)

    if args.seconds > 0:
        body = args.seconds
    elif spoken:
        body = audio_seconds(ffmpeg, voice_path) + 0.9
    else:
        body = 10.0
    body = round(min(MAX_BODY, max(MIN_BODY, body)), 2)

    os.makedirs(os.path.dirname(os.path.abspath(args.out)) or '.', exist_ok=True)
    total = build(ffmpeg, args.image, args.out, body, voice_path if spoken else None, post, tmp)

    shutil.rmtree(tmp, ignore_errors=True)
    print(json.dumps({
        'ok': True, 'out': os.path.abspath(args.out), 'seconds': round(total, 2),
        'voice': spoken, 'bytes': os.path.getsize(args.out),
    }))


if __name__ == '__main__':
    main()
