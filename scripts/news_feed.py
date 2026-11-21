#!/usr/bin/env python3
"""Pick three safe, attributable news headlines from Google News for an awareness reel.

Why Google News: it is a public RSS index, needs no API key, and every item
carries the publisher's name and a link back to the original article. That is
what keeps this lawful and cheap:

  * we keep the HEADLINE and the LINK, never the article body;
  * every headline is shown with its publisher's name;
  * the caption carries the link, so a reader always reaches the source;
  * we never download or re-publish the publisher's photos or logo — the cards
    are drawn by us.

The topic list is deliberately narrow (education, health, environment, women and
children, welfare schemes, rural development) and a blocklist drops crime,
politics, entertainment and dry government notices — subjects an NGO should not
be commenting on, or that nobody would watch.

Usage:
  python3 scripts/news_feed.py --slot morning --out /tmp/news.json
"""

import argparse
import datetime as dt
import json
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

FEED = 'https://news.google.com/rss/search?'
BATCH = 'https://news.google.com/_/DotsSplashUi/data/batchexecute'
UA = ('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) '
      'Chrome/120.0 Safari/537.36')

TOPICS = [
    {'key': 'education', 'labelHi': 'शिक्षा', 'labelEn': 'Education',
     'q': '(शिक्षा OR स्कूल OR छात्रवृत्ति OR पढ़ाई)'},
    {'key': 'health', 'labelHi': 'स्वास्थ्य', 'labelEn': 'Health',
     'q': '(स्वास्थ्य OR अस्पताल OR पोषण OR टीकाकरण)'},
    {'key': 'environment', 'labelHi': 'पर्यावरण', 'labelEn': 'Environment',
     'q': '(पर्यावरण OR वृक्षारोपण OR जल संरक्षण OR स्वच्छता)'},
    {'key': 'women', 'labelHi': 'महिला और बालिका', 'labelEn': 'Women and girls',
     'q': '(महिला सशक्तिकरण OR बालिका शिक्षा OR कन्या)'},
    {'key': 'welfare', 'labelHi': 'सरकारी योजना', 'labelEn': 'Welfare schemes',
     'q': '(सरकारी योजना OR सामाजिक कल्याण OR छात्रवृत्ति योजना)'},
    {'key': 'rural', 'labelHi': 'गांव और किसान', 'labelEn': 'Rural India',
     'q': '(ग्रामीण विकास OR किसान OR खेती)'},
    {'key': 'child', 'labelHi': 'बाल अधिकार', 'labelEn': 'Child rights',
     'q': '(बाल अधिकार OR बाल संरक्षण OR बच्चों की शिक्षा)'},
]

# Subjects that make a bad fit for a foundation's awareness post: they invite a
# political reading, they are not ours to comment on, or they are paperwork.
BLOCK = [
    'हत्या', 'मौत', 'मृत', 'दुर्घटना', 'अपराध', 'बलात्कार', 'यौन', 'पोर्न',
    'आतंक', 'युद्ध', 'दंगा', 'हमला', 'गिरफ्तार', 'आत्महत्या', 'सुसाइड',
    'चुनाव', 'राजनीति', 'मंत्री', 'सीएम', 'मुख्यमंत्री', 'पीएम', 'प्रधानमंत्री',
    'पार्टी', 'विधायक', 'सांसद', 'कांग्रेस', 'भाजपा', 'राहुल', 'मोदी',
    'शेयर बाजार', 'सेंसेक्स', 'क्रिकेट', 'बॉलीवुड', 'फिल्म', 'सेलिब्रिटी',
    'सीरियल', 'अफवाह', 'विवाद', 'मामला दर्ज', 'कोर्ट', 'सीबीआई', 'ईडी ',
    'प्रवर्तन निदेशालय', 'जांच', 'देखिए', 'वीडियो', 'लाइव',
    # paperwork and protocol: technically news, nothing to be aware about
    'राजभाषा', 'निरीक्षण', 'नियुक्ति', 'स्थानांतरण', 'टेंडर', 'विज्ञाप्ति',
    'अधिसूचना', 'सर्कुलर', 'बैठक', 'समीक्षा बैठक', 'परीक्षा परिणाम', 'काउंसलिंग',
]

# Outlets whose reporting we are comfortable pointing at. Not a requirement —
# only a tie-breaker when two headlines are equally fresh.
CREDIBLE = [
    'bbc', 'pib', 'the hindu', 'indian express', 'downtoearth', 'down to earth',
    'ndtv', 'amar ujala', 'dainik bhaskar', 'bhaskar', 'live hindustan',
    'livehindustan', 'hindustan', 'jagran', 'prabhat khabar', 'patrika',
    'times of india', 'hindustan times', 'firstpost', 'the wire', 'scroll',
    'mint', 'business standard',
]

# Google sometimes prefixes the outlet's own section name.
PREFIX = re.compile(r'^(delhi ncr news|breaking news|video|watch|live|exclusive|'
                    r'big news|top news|explainer|analysis|opinion|खास खबर|'
                    r'बड़ी खबर|ताज़ा खबर|वीडियो|देखें)\s*[:：\-–]\s*', re.I)

MAX_TITLE = 88
BEST_TITLE = 80
# Telegram caps a video caption at 1,024 characters and the publisher appends a
# donate footer of its own, so the news body has to stay comfortably under that.
MAX_CAPTION = 820
MAX_AGE_HOURS = 36


def fetch(url, timeout=25):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=timeout) as res:
        return res.read()


def feed_url(query):
    return FEED + urllib.parse.urlencode({
        'q': f'{query} when:1d', 'hl': 'hi', 'gl': 'IN', 'ceid': 'IN:hi',
    })


def resolve(link, timeout=15):
    """Decode Google's wrapped link to the publisher's own URL.

    Google News serves an opaque article id that only its page script can turn
    into the real address. The page carries the two values that script needs, so
    the same call can be made from here. Any failure simply returns None and the
    caller keeps the Google link — a missing shortcut must never stop the post.
    """
    try:
        page = fetch(link, timeout).decode('utf-8', 'ignore')
        ts = re.search(r'data-n-a-ts="(\d+)"', page)
        sg = re.search(r'data-n-a-sg="([^"]+)"', page)
        if not ts or not sg or '/articles/' not in link:
            return None
        article_id = link.split('/articles/')[1].split('?')[0]
        inner = ['garturlreq',
                 [['X', 'X', ['X', 'X'], None, None, 1, 1, 'US:en', None, 1, None,
                   None, None, None, None, 0, 1], 'X', 'X', 1, [1, 1, 1], 1, 1,
                  None, 0, 0, None, 0],
                 article_id, int(ts.group(1)), sg.group(1)]
        body = urllib.parse.urlencode({
            'f.req': json.dumps([[['Fbv4je', json.dumps(inner)]]]),
        }).encode()
        req = urllib.request.Request(BATCH, data=body, headers={
            'User-Agent': UA,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        })
        with urllib.request.urlopen(req, timeout=timeout) as res:
            out = res.read().decode('utf-8', 'ignore')
        # The URL sits inside an escaped JSON string, so stop at the backslash
        # rather than expecting a closing quote.
        found = re.search(r'(https?://[^"\\\s]+)', out)
        return found.group(1) if found else None
    except Exception:
        return None


def domain(url):
    try:
        host = urllib.parse.urlsplit(url).netloc.lower()
        return host[4:] if host.startswith('www.') else host
    except Exception:
        return ''


def _norm(text):
    return re.sub(r'[^a-z0-9\u0900-\u097F]+', ' ', (text or '').lower()).strip()


def _tokens(text):
    return {t for t in _norm(text).split() if len(t) > 2}


def similar(a, b):
    """Same story, two outlets: enough shared words to count as a duplicate."""
    ta, tb = _tokens(a), _tokens(b)
    if not ta or not tb:
        return False
    return len(ta & tb) / min(len(ta), len(tb)) >= 0.6


def _parse_date(raw):
    for fmt in ('%a, %d %b %Y %H:%M:%S %Z', '%a, %d %b %Y %H:%M:%S %z'):
        try:
            parsed = dt.datetime.strptime(raw.strip(), fmt)
            return parsed.replace(tzinfo=parsed.tzinfo or dt.timezone.utc)
        except (ValueError, AttributeError):
            continue
    return None


def parse(xml_bytes, now=None):
    """RSS bytes -> candidate dicts (title, source, link, published)."""
    now = now or dt.datetime.now(dt.timezone.utc)
    root = ET.fromstring(xml_bytes)
    out = []
    for item in root.findall('.//item'):
        title = (item.findtext('title') or '').strip()
        link = (item.findtext('link') or '').strip()
        source = (item.findtext('source') or '').strip()
        published = _parse_date(item.findtext('pubDate') or '')
        if not title or not link:
            continue
        # Google appends " - Publisher" to the headline; the <source> already
        # names it, so drop the duplicate.
        if source and title.endswith(' - ' + source):
            title = title[: -(len(source) + 3)].strip()
        elif ' - ' in title and not source:
            head, _, tail = title.rpartition(' - ')
            if 2 < len(tail) < 40:
                title, source = head.strip(), tail.strip()
        title = PREFIX.sub('', title).strip()
        age = None if published is None else (now - published).total_seconds() / 3600
        out.append({
            'title': title, 'source': source, 'link': link,
            'published': published.isoformat() if published else None,
            'ageHours': None if age is None else round(age, 1),
        })
    return out


def safe(item):
    """Drop anything outside the subjects we are willing to carry."""
    title = item['title']
    low = title.lower()
    if any(word in low for word in BLOCK):
        return False
    if len(title) < 18 or len(title) > 220:
        return False
    if item.get('ageHours') is not None and item['ageHours'] > MAX_AGE_HOURS:
        return False
    return True


def trim(title, limit=MAX_TITLE):
    if len(title) <= limit:
        return title
    cut = title[:limit].rsplit(' ', 1)[0]
    return cut.rstrip(' ,.;:') + '…'


def score(item):
    """Fresh, credible, and short enough to read on a phone in one glance."""
    credit = sum(1 for c in CREDIBLE if c in (item['source'] or '').lower())
    age = item['ageHours'] if item['ageHours'] is not None else 24
    length = len(item['title'])
    penalty = 0 if length <= BEST_TITLE else (length - BEST_TITLE) / 6
    return (-credit * 10) + age + penalty


def gather(slot='morning', count=3, topics=None, now=None, resolve_links=True):
    """Fetch the rotated topics and return up to `count` distinct safe stories."""
    now = now or dt.datetime.now(dt.timezone.utc)
    day = now.timetuple().tm_yday
    order = topics or TOPICS
    # A different half of the subject list each slot, so morning and evening
    # never carry the same three headlines.
    start = (day + (0 if slot == 'morning' else len(order) // 2)) % len(order)
    chosen = [order[(start + i) % len(order)] for i in range(len(order))]

    picked, seen, errors = [], [], []
    for topic in chosen:
        if len(picked) >= count:
            break
        try:
            items = parse(fetch(feed_url(topic['q'])), now=now)
        except Exception as e:  # a dead feed must not kill the run
            errors.append(f"{topic['key']}: {e}")
            continue
        items = [it for it in items if safe(it)]
        items.sort(key=score)
        for item in items:
            if any(similar(item['title'], s['title']) for s in seen):
                continue
            item = {**item, 'topic': topic['key'], 'topicHi': topic['labelHi'],
                    'topicEn': topic['labelEn'], 'title': trim(item['title'])}
            url = resolve(item['link']) if resolve_links else None
            item['url'] = url or item['link']
            item['domain'] = domain(item['url'])
            picked.append(item)
            seen.append(item)
            break

    return {'slot': slot, 'items': picked, 'errors': errors,
            'fetchedAt': now.isoformat()}


def caption_hi(payload):
    """The Hindi caption: headline, publisher, link — nothing copied."""
    lines = ['आज की ज़रूरी खबरें — एक नज़र में']
    for n, item in enumerate(payload['items'], start=1):
        lines.append(f"{n}. {item['title']}")
        lines.append(f"स्रोत: {item['source'] or item['domain'] or 'स्रोत'} — {item['url']}")
    lines.append('जानकारी और जागरूकता के लिए साझा। पूरी खबर स्रोत पर पढ़ें। SSF इन खबरों का स्वामी नहीं।')
    return '\n'.join(lines)


def caption_en(payload):
    lines = ["Today's news at a glance"]
    for n, item in enumerate(payload['items'], start=1):
        lines.append(f"{n}. {item['title']}")
        lines.append(f"Source: {item['source'] or item['domain'] or 'source'} — {item['url']}")
    lines.append('Shared for awareness only. Read the full story at the source. SSF does not own this news.')
    return '\n'.join(lines)


def main():
    ap = argparse.ArgumentParser(description='Pick safe news headlines from Google News.')
    ap.add_argument('--slot', default='morning', choices=['morning', 'evening'])
    ap.add_argument('--count', type=int, default=3)
    ap.add_argument('--no-resolve', action='store_true', help='keep the Google News links')
    ap.add_argument('--out', required=True)
    args = ap.parse_args()

    payload = gather(slot=args.slot, count=args.count, resolve_links=not args.no_resolve)
    if len(payload['items']) < 2:
        print(json.dumps({'ok': False, 'reason': 'not-enough-safe-stories',
                          'errors': payload['errors']}, ensure_ascii=False), file=sys.stderr)
        sys.exit(2)

    ist = dt.timezone(dt.timedelta(hours=5, minutes=30))
    payload['date'] = dt.datetime.now(ist).date().isoformat()
    # Three headlines are the target; drop to two rather than let a platform cut
    # the third source link off the end of the caption.
    while len(payload['items']) > 2 and len(caption_hi(payload)) > MAX_CAPTION:
        payload['items'] = payload['items'][:-1]
    payload['bodyHi'] = caption_hi(payload)
    payload['bodyEn'] = caption_en(payload)
    payload['titleHi'] = 'आज की ज़रूरी खबरें'
    payload['titleEn'] = "Today's news at a glance"
    payload['hashtags'] = '#SwastikSrijan #Samachar #Jagrukta #NGO #India'

    with open(args.out, 'w', encoding='utf-8') as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=2)
    print(json.dumps({'ok': True, 'count': len(payload['items']),
                      'titles': [i['title'][:70] for i in payload['items']],
                      'domains': [i['domain'] for i in payload['items']],
                      'captionChars': len(payload['bodyHi']),
                      'errors': payload['errors']}, ensure_ascii=False))


if __name__ == '__main__':
    main()
