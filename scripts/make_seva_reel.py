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

Usage:
  python3 scripts/make_seva_reel.py --group group.json --index 3 --out reel.mp4
  group.json = {"titleHi": "...", "titleEn": "...", "ideas": [{"hi","en","how"}, ...]}
"""

import argparse
import json
import os
import shutil
import sys
import tempfile

from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_reel as mr  # noqa: E402  (shared card, voice and ffmpeg helpers)

W, H = mr.W, mr.H
HOOK_SECONDS = 3.0
END_SECONDS = mr.END_SECONDS
MIN_CARD, MAX_CARD = 3.6, 7.0
HELP_SECONDS = 3.6


def _centre(draw, text, fnt, y, fill):
    draw.text(((W - draw.textlength(text, font=fnt)) / 2, y), text, font=fnt, fill=fill)


def _centre_wrapped(draw, text, fnt, y, fill, max_width=W - 200, leading=None):
    lines = mr.wrap(draw, text, fnt, max_width)
    step = leading or int(fnt.size * 1.32)
    top = y - (len(lines) - 1) * step // 2
    for i, line in enumerate(lines):
        _centre(draw, line, fnt, top + i * step, fill)
    return top + len(lines) * step


def hook_card(group, index, out_path):
    img = mr.glow(mr.gradient(W, H, mr.NAVY, mr.NAVY_LIGHT), W // 2, H - 700, 520, mr.GOLD, 60)
    d = ImageDraw.Draw(img)
    mr.brand_bar(img, d)

    _centre(d, 'मदद करने के हज़ार तरीके', mr.font('NotoSansDevanagari-Bold.ttf', 66), 330, mr.WHITE)
    _centre(d, 'A thousand ways to help', mr.font('NotoSans-Regular.ttf', 34), 430, (198, 214, 232))

    d.line([(W // 2 - 140, 520), (W // 2 + 140, 520)], fill=mr.GOLD, width=3)
    _centre_wrapped(d, group.get('titleHi') or '', mr.font('NotoSansDevanagari-Bold.ttf', 78), 700, mr.GOLD_BRIGHT)
    _centre(d, group.get('titleEn') or '', mr.font('NotoSans-Regular.ttf', 38), 830, (206, 222, 238))

    # The series counter tells a new viewer this is one of many, so they keep watching.
    label = f"तरीका #{index + 1}"
    fnt = mr.font('NotoSansDevanagari-Bold.ttf', 44)
    tw = d.textlength(label, font=fnt)
    d.rounded_rectangle([(W - tw) / 2 - 44, 940, (W + tw) / 2 + 44, 1030], radius=45,
                        outline=mr.GOLD, width=3)
    _centre(d, label, fnt, 955, mr.WHITE)
    _centre(d, mr.SITE, mr.font('NotoSans-Bold.ttf', 32), H - 130, (200, 216, 232))
    img.save(out_path)


def idea_card(idea, number, out_path):
    img = mr.glow(mr.gradient(W, H, mr.NAVY_LIGHT, mr.NAVY), W // 2, 560, 480, mr.GOLD, 45)
    d = ImageDraw.Draw(img)
    mr.brand_bar(img, d)

    # Numbered medallion: three cards read as a list, not as a wall of text.
    cx, cy, r = W // 2, 430, 92
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=mr.GOLD, width=5)
    d.ellipse([cx - r + 16, cy - r + 16, cx + r - 16, cy + r - 16], fill=(255, 255, 255, 18))
    num = f'{number:02d}'
    nf = mr.font('NotoSans-Bold.ttf', 92)
    d.text((cx - d.textlength(num, font=nf) / 2, cy - 62), num, font=nf, fill=mr.GOLD_BRIGHT)

    bottom = _centre_wrapped(d, idea.get('hi') or '', mr.font('NotoSansDevanagari-Bold.ttf', 70), 760, mr.WHITE)
    d.line([(W // 2 - 120, bottom + 40), (W // 2 + 120, bottom + 40)], fill=mr.GOLD, width=3)
    _centre_wrapped(d, idea.get('en') or '', mr.font('NotoSans-Regular.ttf', 42), bottom + 110, mr.GOLD_BRIGHT)
    _centre_wrapped(d, idea.get('how') or '', mr.font('NotoSansDevanagari-Regular.ttf', 34), bottom + 210, (176, 196, 216))

    _centre(d, 'आप भी मदद कर सकते हैं', mr.font('NotoSansDevanagari-Regular.ttf', 36), H - 210, (200, 216, 232))
    _centre(d, mr.SITE, mr.font('NotoSans-Bold.ttf', 32), H - 130, (200, 216, 232))
    img.save(out_path)


def help_card(out_path):
    """Before the ask: the viewer can do this themselves, for free."""
    img = mr.glow(mr.gradient(W, H, mr.NAVY, mr.NAVY_LIGHT), W // 2, 620, 500, mr.GOLD, 55)
    d = ImageDraw.Draw(img)
    mr.brand_bar(img, d)

    _centre_wrapped(d, 'ये आप खुद भी कर सकते हैं', mr.font('NotoSansDevanagari-Bold.ttf', 76), 700, mr.WHITE)
    d.line([(W // 2 - 140, 830), (W // 2 + 140, 830)], fill=mr.GOLD, width=3)
    _centre_wrapped(d, 'पैसा ज़रूरी नहीं, समय भी काफ़ी है', mr.font('NotoSansDevanagari-Regular.ttf', 44), 910, mr.GOLD_BRIGHT)
    _centre_wrapped(d, 'अपने मोहल्ले, स्कूल या गांव से शुरुआत करें।', mr.font('NotoSansDevanagari-Regular.ttf', 34), 1010, (200, 216, 232))
    _centre_wrapped(d, 'You can do this yourself — no money needed.', mr.font('NotoSans-Regular.ttf', 30), 1090, (186, 204, 224))

    _centre(d, mr.SITE, mr.font('NotoSans-Bold.ttf', 32), H - 130, (200, 216, 232))
    img.save(out_path)


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
    ap.add_argument('--group', required=True, help='JSON file: {titleHi,titleEn,ideas[]}')
    ap.add_argument('--index', type=int, default=0, help='series number shown on the hook')
    ap.add_argument('--out', required=True)
    ap.add_argument('--voice', default=os.environ.get('REEL_VOICE', mr.DEFAULT_VOICE))
    ap.add_argument('--no-voice', action='store_true')
    args = ap.parse_args()

    with open(args.group, encoding='utf-8') as fh:
        group = json.load(fh)
    ideas = (group.get('ideas') or [])[:3]
    if not ideas:
        sys.exit('group has no ideas')

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

        parts = []
        hook = os.path.join(tmp, 'hook.png')
        hook_card(group, args.index, hook)
        seg = os.path.join(tmp, 'hook.mp4')
        mr.segment(ffmpeg, hook, seg, HOOK_SECONDS, zoom=False)
        parts.append(seg)

        for n, idea in enumerate(ideas, start=1):
            png = os.path.join(tmp, f'idea{n}.png')
            idea_card(idea, n, png)
            seg = os.path.join(tmp, f'idea{n}.mp4')
            mr.segment(ffmpeg, png, seg, card, zoom=True)
            parts.append(seg)

        help_png = os.path.join(tmp, 'help.png')
        help_card(help_png)
        seg = os.path.join(tmp, 'help.mp4')
        mr.segment(ffmpeg, help_png, seg, HELP_SECONDS, zoom=True)
        parts.append(seg)

        end = os.path.join(tmp, 'end.png')
        mr.end_card(end)
        seg = os.path.join(tmp, 'end.mp4')
        mr.segment(ffmpeg, end, seg, END_SECONDS, zoom=True)
        parts.append(seg)

        listing = os.path.join(tmp, 'parts.txt')
        with open(listing, 'w', encoding='utf-8') as fh:
            for part in parts:
                fh.write(f"file '{part}'\n")
        joined = os.path.join(tmp, 'joined.mp4')
        mr.run([ffmpeg, '-y', '-hide_banner', '-loglevel', 'error', '-f', 'concat', '-safe', '0',
                '-i', listing, '-c', 'copy', joined])

        total = HOOK_SECONDS + card * len(ideas) + HELP_SECONDS + END_SECONDS
        os.makedirs(os.path.dirname(os.path.abspath(args.out)) or '.', exist_ok=True)
        mr.mux(ffmpeg, joined, voice_path if spoken else None, args.out, total, HOOK_SECONDS)
        print(json.dumps({'ok': True, 'out': os.path.abspath(args.out), 'seconds': round(total, 2),
                          'voice': spoken, 'cardSeconds': card, 'bytes': os.path.getsize(args.out)}))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    main()
