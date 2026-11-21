#!/usr/bin/env python3
"""Render one "मदद करने के हज़ार तरीके" reel: hook, three ways to help, donate card.

Shares the drawing, voice, music and ffmpeg helpers with make_reel.py so a change
to the end card (the QR + UPI ask) lands on every reel, not just the post ones.

Everything stays free: ffmpeg, Pillow, edge-tts, and a synthesised music bed.

Reel shape:
  0.0s   hook   - "मदद करने के हज़ार तरीके" + the theme + तरीका number
  3.0s   3 cards - one way to help each, with its Hindi line and English gloss
  +3.6s  "you can do this yourself" - the suggestion stands on its own
  end    donate - and only then: QR, UPI id, donate page

The cards sit on the foundation's own photographs (darkened to a navy scrim) with
a slow push-in, crossfades between scenes and a gold progress line, so the reel
reads as a video rather than a slideshow of slides.

Usage:
  python3 scripts/make_seva_reel.py --group group.json --index 3 --out reel.mp4
  group.json = {"key": "education", "titleHi": "...", "titleEn": "...",
                "ideas": [{"hi","en","how"}, ...]}
"""

import argparse
import json
import os
import shutil
import sys
import tempfile

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_reel as mr  # noqa: E402  (shared card, voice and ffmpeg helpers)

W, H = mr.W, mr.H
HOOK_SECONDS = 3.0
END_SECONDS = mr.END_SECONDS
MIN_CARD, MAX_CARD = 3.6, 7.0
HELP_SECONDS = 3.6
XFADE = 0.6
FRAME = (36, 36, W - 36, H - 36)

# One set of real field photographs per theme. A scene picks its photo from this
# list (rotating with the idea number) so the three ways of one reel do not
# repeat the same picture.
PHOTOS = {
    'education': ['scholarship_distribution.jpg', 'classroom-floor-seating.jpg',
                  'girls-study-group-mat.jpg', 'coaching_center_1.jpg'],
    'kanya': ['education_girls.jpg', 'girls-study-group-mat.jpg',
              'girls-group-learning-close.jpg', 'women_empowerment_tailoring.jpg'],
    'smile': ['children-playing-circle.jpg', 'cricket-child.jpg',
              'children-playing-park.jpg', 'park-activity-session.jpg'],
    'environment': ['tree_plantation.jpg', 'tree_planting_2.jpg', 'green-warriors-students.jpg'],
    'swachh': ['rural-awareness.jpg', 'children-gathering.jpg', 'community-rally-children.jpg'],
    'gau': ['cow-rescue.jpg', 'village-community-center.jpg'],
    'health': ['health-center-visit.jpg', 'vision-health-camp.jpg',
               'medical-support-effort.jpg', 'plasma-donation-real.jpg'],
    'elder': ['gorakhpur-woman-aid.jpg', 'direct-aid-mask.jpg', 'midday-meal-gathering.jpg'],
    'food': ['midday-meal-gathering.jpg', 'nutrition_program.jpg', 'children-mat-session.jpg'],
    'livelihood': ['women_empowerment_tailoring.jpg', 'coaching_center_1.jpg',
                   'girls-study-group-mat.jpg'],
    'reach': ['village-community-center.jpg', 'rural-mask-distribution.jpg',
              'health-center-visit.jpg'],
    'together': ['women_community_meeting.jpg', 'children-gathering.jpg', 'ssf_event_members.jpg'],
}
FALLBACK = ['children-playing-circle.jpg', 'tree_plantation.jpg', 'health-center-visit.jpg']


def _centre(draw, text, fnt, y, fill, shadow=True):
    # Mixed Hindi/Latin strings need one face per script, so the shared helper
    # draws them run by run and centres the whole line.
    mr.draw_text(draw, text, fnt, (0, y), fill, centre_w=W, shadow=shadow)


def _centre_wrapped(draw, text, fnt, y, fill, max_width=W - 200, leading=None, shadow=True):
    lines = mr.wrap_mixed(draw, text, fnt, max_width)
    step = leading or int(fnt.size * 1.32)
    top = y - (len(lines) - 1) * step // 2
    for i, line in enumerate(lines):
        _centre(draw, line, fnt, top + i * step, fill, shadow)
    return top + len(lines) * step


# ---- photo backdrops -------------------------------------------------------

def _photo_dir():
    return os.path.join(mr.ROOT, 'public', 'images', 'real')


def _load(name):
    try:
        return Image.open(os.path.join(_photo_dir(), name)).convert('RGB')
    except Exception:
        return None


def _cover(im, w, h):
    scale = max(w / im.width, h / im.height)
    im = im.resize((max(w, int(im.width * scale + 0.5)), max(h, int(im.height * scale + 0.5))),
                   Image.LANCZOS)
    left = (im.width - w) // 2
    top = (im.height - h) // 2
    return im.crop((left, top, left + w, top + h))


def backdrop(key, seed, dim=0.6):
    """A field photograph, darkened to navy so white type stays readable."""
    names = PHOTOS.get(key) or FALLBACK
    im = None
    for step in range(len(names)):
        im = _load(names[(seed + step) % len(names)])
        if im is not None:
            break
    if im is None:
        return mr.glow(mr.gradient(W, H, mr.NAVY, mr.NAVY_LIGHT), W // 2, H // 2, 900, mr.GOLD, 40)

    im = _cover(im, W, H)
    im = ImageEnhance.Color(im).enhance(0.85)
    im = Image.blend(im, Image.new('RGB', (W, H), mr.NAVY), dim)

    # Heavier at the top and bottom, where the brand bar and the text sit.
    veil = Image.new('L', (1, H))
    for y in range(H):
        t = y / (H - 1)
        veil.putpixel((0, y), int(255 * (0.52 * (1 - t) ** 2 + 0.66 * t ** 2)))
    dark = Image.new('RGB', (W, H), (2, 16, 30))
    return Image.composite(dark, im, veil.resize((W, H)))


def _frame(img):
    """Thin gold hairline so a photo scene reads as a designed card."""
    d = ImageDraw.Draw(img, 'RGBA')
    d.rounded_rectangle(FRAME, radius=48, outline=(214, 181, 109, 105), width=3)


def _plate(img, box, alpha=140, blur=16):
    """Frosted navy plate: the photo is blurred behind the text, not hidden."""
    x0, y0, x1, y1 = (int(v) for v in box)
    region = img.crop((x0, y0, x1, y1)).filter(ImageFilter.GaussianBlur(blur))
    mask = Image.new('L', (x1 - x0, y1 - y0), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, x1 - x0 - 1, y1 - y0 - 1], radius=40, fill=255)
    img.paste(region, (x0, y0), mask)

    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).rounded_rectangle(box, radius=40, fill=mr.NAVY + (alpha,))
    return Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')


def _scrim_for(img, top, bottom):
    return _plate(img, [FRAME[0] + 20, top, FRAME[2] - 20, bottom])


# ---- cards -----------------------------------------------------------------

def hook_card(group, index, out_path, key):
    img = backdrop(key, 0, dim=0.62)
    img = _scrim_for(img, 250, 1130)
    d = ImageDraw.Draw(img, 'RGBA')
    mr.brand_bar(img, d)
    _frame(img)

    _centre(d, 'मदद करने के हज़ार तरीके', mr.font('NotoSansDevanagari-Bold.ttf', 62), 330, mr.WHITE)
    _centre(d, 'A thousand ways to help', mr.font('NotoSans-Regular.ttf', 32), 420, (198, 214, 232))

    d.line([(W // 2 - 140, 500), (W // 2 + 140, 500)], fill=mr.GOLD, width=3)
    _centre_wrapped(d, group.get('titleHi') or '', mr.font('NotoSansDevanagari-Bold.ttf', 78), 660, mr.GOLD_BRIGHT)
    _centre(d, group.get('titleEn') or '', mr.font('NotoSans-Regular.ttf', 38), 790, (206, 222, 238))

    # The series counter tells a new viewer this is one of many, so they keep watching.
    label = f"तरीका #{index + 1}"
    fnt = mr.font('NotoSansDevanagari-Bold.ttf', 44)
    tw = d.textlength(label, font=fnt)
    d.rounded_rectangle([(W - tw) / 2 - 44, 900, (W + tw) / 2 + 44, 990], radius=45,
                        outline=mr.GOLD, width=3)
    _centre(d, label, fnt, 915, mr.WHITE)

    _centre(d, 'आज का काम — तीन तरीके', mr.font('NotoSansDevanagari-Regular.ttf', 30), 1030, (196, 214, 232))
    _centre(d, mr.SITE, mr.font('NotoSans-Bold.ttf', 32), H - 130, (200, 216, 232))
    img.save(out_path)


def idea_card(idea, number, out_path, key, seed):
    img = backdrop(key, seed, dim=0.58)
    img = _scrim_for(img, 300, 1180)
    d = ImageDraw.Draw(img, 'RGBA')
    mr.brand_bar(img, d)
    _frame(img)

    # Numbered medallion: three cards read as a list, not as a wall of text.
    cx, cy, r = W // 2, 400, 88
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=mr.GOLD, width=5, fill=(0, 24, 46, 150))
    num = f'{number:02d}'
    nf = mr.font('NotoSans-Bold.ttf', 88)
    d.text((cx - d.textlength(num, font=nf) / 2, cy - 58), num, font=nf, fill=mr.GOLD_BRIGHT)

    bottom = _centre_wrapped(d, idea.get('hi') or '', mr.font('NotoSansDevanagari-Bold.ttf', 70), 700, mr.WHITE)
    d.line([(W // 2 - 120, bottom + 44), (W // 2 + 120, bottom + 44)], fill=mr.GOLD, width=3)
    _centre_wrapped(d, idea.get('en') or '', mr.font('NotoSans-Regular.ttf', 42), bottom + 118, mr.GOLD_BRIGHT)
    _centre_wrapped(d, idea.get('how') or '', mr.font('NotoSansDevanagari-Regular.ttf', 34), bottom + 218, (186, 206, 226))

    _centre(d, 'आप भी मदद कर सकते हैं', mr.font('NotoSansDevanagari-Regular.ttf', 36), H - 210, (200, 216, 232))
    _centre(d, mr.SITE, mr.font('NotoSans-Bold.ttf', 32), H - 130, (200, 216, 232))
    img.save(out_path)


def help_card(out_path, key):
    """Before the ask: the viewer can do this themselves, for free."""
    img = backdrop(key, 2, dim=0.64)
    img = _scrim_for(img, 560, 1200)
    d = ImageDraw.Draw(img, 'RGBA')
    mr.brand_bar(img, d)
    _frame(img)

    _centre_wrapped(d, 'ये आप खुद भी कर सकते हैं', mr.font('NotoSansDevanagari-Bold.ttf', 76), 700, mr.WHITE)
    d.line([(W // 2 - 140, 830), (W // 2 + 140, 830)], fill=mr.GOLD, width=3)
    _centre_wrapped(d, 'पैसा ज़रूरी नहीं, समय भी काफ़ी है', mr.font('NotoSansDevanagari-Regular.ttf', 44), 910, mr.GOLD_BRIGHT)
    _centre_wrapped(d, 'अपने मोहल्ले, स्कूल या गांव से शुरुआत करें।', mr.font('NotoSansDevanagari-Regular.ttf', 34), 1010, (200, 216, 232))
    _centre_wrapped(d, 'You can do this yourself — no money needed.', mr.font('NotoSans-Regular.ttf', 30), 1090, (186, 204, 224))

    _centre(d, mr.SITE, mr.font('NotoSans-Bold.ttf', 32), H - 130, (200, 216, 232))
    img.save(out_path)


# ---- video -----------------------------------------------------------------

def scene(ffmpeg, still, out, seconds, zoom=True):
    """One still -> a clip with a slow push-in, at a constant frame rate.

    No fade in/out here: the scenes are joined with crossfades, so an edge fade
    would dip the picture to black in the middle of a transition.
    """
    if zoom:
        vf = ("zoompan=z='min(1.045,1+0.00045*on)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
              f":d=1:s={W}x{H}:fps={mr.FPS}")
    else:
        vf = f'scale={W}:{H}'
    vf += f',fps={mr.FPS},format=yuv420p,settb=AVTB'
    mr.run([ffmpeg, '-y', '-hide_banner', '-loglevel', 'error',
            '-loop', '1', '-framerate', str(mr.FPS), '-t', f'{seconds:.3f}', '-i', still,
            '-vf', vf, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
            '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.0',
            '-r', str(mr.FPS), '-g', str(mr.FPS * 2), out])


def join(ffmpeg, clips, lengths, out, fade=XFADE):
    """Crossfade the clips into one film and burn the progress line on top."""
    total = sum(lengths) - fade * (len(clips) - 1)
    cmd = [ffmpeg, '-y', '-hide_banner', '-loglevel', 'error']
    for clip in clips:
        cmd += ['-i', clip]

    graph = []
    last = '[0:v]'
    offset = 0.0
    for i in range(1, len(clips)):
        offset += lengths[i - 1] - fade
        tag = f'[v{i}]'
        graph.append(f'{last}[{i}:v]xfade=transition=fade:duration={fade:.3f}:offset={offset:.3f}{tag}')
        last = tag
    # drawbox's `t` is the box thickness, not time, so the progress line is an
    # overlay whose x follows the timestamp instead.
    graph.append(f'color=c=0x0A1E33@0.55:s={W}x10:r={mr.FPS}:d={total:.3f}[track]')
    graph.append(f'color=c=0xD6B56D:s={W}x10:r={mr.FPS}:d={total:.3f}[bar]')
    graph.append(f'{last}[track]overlay=x=0:y=0:eof_action=repeat[vt]')
    graph.append(f"[vt][bar]overlay=x='-w+w*t/{total:.3f}':y=0:eof_action=repeat,"
                 f"format=yuv420p[v]")

    cmd += ['-filter_complex', ';'.join(graph), '-map', '[v]',
            '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
            '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.0',
            '-r', str(mr.FPS), '-g', str(mr.FPS * 2), out]
    mr.run(cmd)
    return total


def narration(group, ideas):
    """Spoken the way a person would say it, not the way a form reads."""
    spoken = ['नमस्ते।', 'आज बात सिर्फ़ एक — मदद।',
              f"{group.get('titleHi') or ''}।", 'तीन तरीके, जो आप आज ही कर सकते हैं।']
    for n, idea in enumerate(ideas[:3]):
        spoken.append(f"{('पहला', 'दूसरा', 'तीसरा')[n]} — {idea.get('hi')}. {idea.get('how') or ''}")
    spoken.append('ये तीनों काम आप खुद भी कर सकते हैं। इसमें पैसा नहीं लगता, बस थोड़ा वक़्त लगता है।')
    spoken.append('और अगर वक़्त नहीं है, तो कोई बात नहीं। हमारे फाउंडेशन के ज़रिए आपकी मदद उस तक पहुँच जाएगी।')
    spoken.append(f"नीचे QR स्कैन करें, या {mr.SITE} पर Donate खोलें।")
    return ' '.join(s for s in spoken if s)


def main():
    ap = argparse.ArgumentParser(description='Render a seva-ideas reel.')
    ap.add_argument('--group', required=True, help='JSON file: {key,titleHi,titleEn,ideas[]}')
    ap.add_argument('--index', type=int, default=0, help='series number shown on the hook')
    ap.add_argument('--out', required=True)
    ap.add_argument('--voice', default=os.environ.get('REEL_VOICE', mr.DEFAULT_VOICE))
    ap.add_argument('--no-voice', action='store_true')
    ap.add_argument('--no-photo', action='store_true', help='plain gradient cards instead of photos')
    args = ap.parse_args()

    with open(args.group, encoding='utf-8') as fh:
        group = json.load(fh)
    ideas = (group.get('ideas') or [])[:3]
    if not ideas:
        sys.exit('group has no ideas')
    key = group.get('key') or ''

    ffmpeg = mr.ffmpeg_bin()
    tmp = tempfile.mkdtemp(prefix='seva-')
    try:
        voice_path = os.path.join(tmp, 'voice.mp3')
        text = mr.clean_text(narration(group, ideas))
        spoken = False if args.no_voice else mr.make_voice(text, args.voice, voice_path)

        if spoken:
            audio = mr.audio_seconds(ffmpeg, voice_path)
            card = min(MAX_CARD, max(MIN_CARD, (audio + 1.2) / len(ideas)))
        else:
            card = 4.2
        card = round(card, 2)

        scenes = []
        hook = os.path.join(tmp, 'hook.png')
        hook_card(group, args.index, hook, key)
        scenes.append((hook, HOOK_SECONDS, True))

        for n, idea in enumerate(ideas, start=1):
            png = os.path.join(tmp, f'idea{n}.png')
            idea_card(idea, n, png, key, n)
            scenes.append((png, card, True))

        help_png = os.path.join(tmp, 'help.png')
        help_card(help_png, key)
        scenes.append((help_png, HELP_SECONDS, True))

        # The end card carries the QR codes: keep it still so they stay crisp.
        end = os.path.join(tmp, 'end.png')
        mr.end_card(end)
        scenes.append((end, END_SECONDS, False))

        clips, lengths = [], []
        for i, (still, seconds, zoom) in enumerate(scenes):
            clip = os.path.join(tmp, f'scene{i}.mp4')
            length = seconds + (XFADE if i < len(scenes) - 1 else 0)
            scene(ffmpeg, still, clip, length, zoom=zoom and not args.no_photo)
            clips.append(clip)
            lengths.append(length)

        joined = os.path.join(tmp, 'joined.mp4')
        total = join(ffmpeg, clips, lengths, joined)

        os.makedirs(os.path.dirname(os.path.abspath(args.out)) or '.', exist_ok=True)
        mr.mux(ffmpeg, joined, voice_path if spoken else None, args.out, total, HOOK_SECONDS)
        print(json.dumps({'ok': True, 'out': os.path.abspath(args.out), 'seconds': round(total, 2),
                          'voice': spoken, 'cardSeconds': card, 'bytes': os.path.getsize(args.out)}))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    main()
