#!/usr/bin/env python3
"""Render the daily awareness news reel from the headlines news_feed.py picked.

Shape (about 20 seconds):
  hook      "आज की ज़रूरी खबरें" + the date + the subjects covered
  1..n      one headline per card, always with the publisher's name under it
  end       what this is: information, sources in the caption, no opinion

Nothing is copied: the card carries the headline, the publisher and the subject,
and the caption carries the link. The voice says only the intro — the headlines
are read by the viewer, not by us.

Usage:
  python3 scripts/make_news_reel.py --news /tmp/news.json --out /tmp/news.mp4
"""

import argparse
import json
import os
import shutil
import sys
import tempfile

from PIL import ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_reel as mr  # noqa: E402
from make_seva_reel import _centre as centre, _centre_wrapped as wrap_centre  # noqa: E402
from make_seva_reel import join, scene  # noqa: E402

W, H = mr.W, mr.H
HOOK_SECONDS = 3.4
CARD_SECONDS = 5.6
END_SECONDS = 4.2
XFADE = 0.6

MONTHS_HI = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त',
             'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर']
SLOT_HI = {'morning': 'सुबह की खबरें', 'evening': 'शाम की खबरें'}


def _chip(d, text, y, size=32, fill=None):
    fnt = mr.font('NotoSansDevanagari-Bold.ttf', size)
    tw = mr.text_width(d, text, fnt)
    d.rounded_rectangle([(W - tw) / 2 - 34, y, (W + tw) / 2 + 34, y + size + 34],
                        radius=(size + 34) // 2, outline=mr.GOLD, width=3)
    centre(d, text, fnt, y + 15, fill or mr.GOLD_BRIGHT)


def _footer(d, text='swastiksrijan.in'):
    centre(d, text, mr.font('NotoSans-Bold.ttf', 32), H - 130, (200, 216, 232))


def hook_card(payload, out_path):
    img = mr.glow(mr.gradient(W, H, mr.NAVY, mr.NAVY_LIGHT), W // 2, 700, 620, mr.GOLD, 55)
    d = ImageDraw.Draw(img, 'RGBA')
    mr.brand_bar(img, d)

    centre(d, SLOT_HI.get(payload.get('slot'), 'आज की खबरें'),
           mr.font('NotoSansDevanagari-Regular.ttf', 34), 300, (198, 214, 232))
    centre(d, 'आज की ज़रूरी खबरें', mr.font('NotoSansDevanagari-Bold.ttf', 88), 420, mr.WHITE)
    centre(d, 'एक नज़र में', mr.font('NotoSansDevanagari-Regular.ttf', 46), 570, mr.GOLD_BRIGHT)
    d.line([(W // 2 - 150, 680), (W // 2 + 150, 680)], fill=mr.GOLD, width=3)

    y = 760
    for item in payload.get('items', []):
        _chip(d, item.get('topicHi') or item.get('topicEn') or '', y, 30)
        y += 96

    centre(d, 'जानकारी और जागरूकता के लिए', mr.font('NotoSansDevanagari-Regular.ttf', 32),
           H - 300, (186, 204, 224))
    centre(d, 'Sources in the caption', mr.font('NotoSans-Regular.ttf', 26), H - 250, (170, 190, 210))
    _footer(d)
    img.save(out_path)


def headline_card(item, number, total, out_path):
    img = mr.glow(mr.gradient(W, H, mr.NAVY_LIGHT, mr.NAVY), W // 2, 780, 620, mr.GOLD, 42)
    d = ImageDraw.Draw(img, 'RGBA')
    mr.brand_bar(img, d)

    # "01 / 03" keeps the viewer oriented without adding another element.
    counter = f'{number:02d} / {total:02d}'
    cf = mr.font('NotoSans-Bold.ttf', 30)
    d.text((W - 70 - d.textlength(counter, font=cf), 84), counter, font=cf, fill=(160, 182, 206))

    _chip(d, item.get('topicHi') or item.get('topicEn') or '', 340, 30)

    title = item.get('title') or ''
    fnt = mr.font('NotoSansDevanagari-Bold.ttf', 64)
    lines = mr.wrap_mixed(d, title, fnt, W - 190)
    if len(lines) > 5:
        fnt = mr.font('NotoSansDevanagari-Bold.ttf', 54)
        lines = mr.wrap_mixed(d, title, fnt, W - 190)
    step = int(fnt.size * 1.38)
    top = 700 - (len(lines) - 1) * step // 2
    for i, line in enumerate(lines):
        centre(d, line, fnt, top + i * step, mr.WHITE)

    bottom = top + len(lines) * step
    d.line([(W // 2 - 120, bottom + 40), (W // 2 + 120, bottom + 40)], fill=mr.GOLD, width=3)

    source = item.get('source') or item.get('domain') or ''
    centre(d, f'स्रोत: {source}', mr.font('NotoSansDevanagari-Regular.ttf', 34), bottom + 90, mr.GOLD_BRIGHT)
    if item.get('domain'):
        centre(d, item['domain'], mr.font('NotoSans-Regular.ttf', 26), bottom + 146, (176, 196, 216))

    centre(d, 'पूरी खबर स्रोत पर पढ़ें', mr.font('NotoSansDevanagari-Regular.ttf', 30), H - 250, (200, 216, 232))
    centre(d, 'जानकारी के लिए · जागरूकता के लिए', mr.font('NotoSansDevanagari-Regular.ttf', 26), H - 200, (168, 188, 210))
    _footer(d)
    img.save(out_path)


def end_card(out_path):
    img = mr.glow(mr.gradient(W, H, mr.NAVY, mr.NAVY_LIGHT), W // 2, 640, 560, mr.GOLD, 48)
    d = ImageDraw.Draw(img, 'RGBA')
    mr.brand_bar(img, d)

    wrap_centre(d, 'ये खबरें जानकारी के लिए हैं', mr.font('NotoSansDevanagari-Bold.ttf', 62), 740, mr.WHITE)
    d.line([(W // 2 - 140, 840), (W // 2 + 140, 840)], fill=mr.GOLD, width=3)
    wrap_centre(d, 'किसी खबर पर हमारी राय नहीं है।', mr.font('NotoSansDevanagari-Regular.ttf', 40), 910, mr.GOLD_BRIGHT)
    wrap_centre(d, 'पूरी खबर मूल स्रोत पर पढ़ें — लिंक कैप्शन में हैं।',
                mr.font('NotoSansDevanagari-Regular.ttf', 34), 1000, (200, 216, 232))
    wrap_centre(d, 'Not our news, not our opinion. Every link is in the caption.',
                mr.font('NotoSans-Regular.ttf', 28), 1080, (176, 196, 216))

    centre(d, 'स्वास्तिक सृजन फाउंडेशन · जागरूकता अभियान',
           mr.font('NotoSansDevanagari-Bold.ttf', 36), 1220, mr.GOLD)
    centre(d, 'SSF awareness series', mr.font('NotoSans-Regular.ttf', 28), 1280, (186, 204, 224))
    centre(d, mr.SITE, mr.font('NotoSans-Bold.ttf', 38), 1400, mr.WHITE)
    centre(d, 'हर हाथ काम आता है', mr.font('NotoSansDevanagari-Regular.ttf', 32), H - 220, (200, 216, 232))
    _footer(d)
    img.save(out_path)


def main():
    ap = argparse.ArgumentParser(description='Render the daily news awareness reel.')
    ap.add_argument('--news', required=True, help='JSON from scripts/news_feed.py')
    ap.add_argument('--out', required=True)
    ap.add_argument('--voice', default=os.environ.get('REEL_VOICE', mr.DEFAULT_VOICE))
    ap.add_argument('--no-voice', action='store_true')
    args = ap.parse_args()

    with open(args.news, encoding='utf-8') as fh:
        payload = json.load(fh)
    items = payload.get('items') or []
    if not items:
        sys.exit('news payload has no items')

    ffmpeg = mr.ffmpeg_bin()
    tmp = tempfile.mkdtemp(prefix='news-')
    try:
        # Only the intro is spoken: reading the headlines aloud would be copying
        # more of someone else's work than we need.
        voice_path = os.path.join(tmp, 'voice.mp3')
        spoken = False if args.no_voice else mr.make_voice(
            'नमस्ते। आज की ज़रूरी खबरें, एक नज़र में।', args.voice, voice_path)

        stills = []
        hook = os.path.join(tmp, 'hook.png')
        hook_card(payload, hook)
        stills.append((hook, HOOK_SECONDS, True))

        for n, item in enumerate(items, start=1):
            png = os.path.join(tmp, f'news{n}.png')
            headline_card(item, n, len(items), png)
            stills.append((png, CARD_SECONDS, True))

        end = os.path.join(tmp, 'end.png')
        end_card(end)
        stills.append((end, END_SECONDS, True))

        clips, lengths = [], []
        for i, (still, seconds, zoom) in enumerate(stills):
            clip = os.path.join(tmp, f'scene{i}.mp4')
            length = seconds + (XFADE if i < len(stills) - 1 else 0)
            scene(ffmpeg, still, clip, length, zoom=zoom)
            clips.append(clip)
            lengths.append(length)

        joined = os.path.join(tmp, 'joined.mp4')
        total = join(ffmpeg, clips, lengths, joined)

        os.makedirs(os.path.dirname(os.path.abspath(args.out)) or '.', exist_ok=True)
        mr.mux(ffmpeg, joined, voice_path if spoken else None, args.out, total, 0.4)
        print(json.dumps({'ok': True, 'out': os.path.abspath(args.out), 'seconds': round(total, 2),
                          'cards': len(items), 'voice': spoken, 'bytes': os.path.getsize(args.out)}))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    main()
