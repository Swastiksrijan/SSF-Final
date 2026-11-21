# Auto reels (free, no paid API)

The site already publishes an image post every day. This workflow turns those
posts into 9:16 reels and publishes them to the same accounts.

Nothing here costs money and nothing needs a new account:

| Piece | What it is |
| --- | --- |
| Render | `scripts/make_reel.py` builds the MP4 with ffmpeg (installed by the workflow) |
| Voice | `edge-tts` (`hi-IN-SwaraNeural`), the Microsoft Edge read-aloud voices; gTTS then silence as fallbacks |
| Music | a soft pad synthesised by ffmpeg itself, so there is no copyright to clear and no file to ship |
| Cards | Pillow + Raqm with Noto fonts, so Hindi conjuncts shape correctly |
| Publish | the existing backend route `POST /api/social/reel`, which uses the channels already connected in IMS → Social Media |

## What a reel looks like

```
0.0s ─ hook card      "आज की बात / TODAY'S MESSAGE" + the bilingual message + SSF lockup
2.6s ─ poster          the published poster, blurred backdrop, slow zoom, Hindi narration
 end ─ end card        "Follow SSF / SSF को फॉलो करें" + swastiksrijan.in
```

1080×1920, 30 fps, h264 + aac, roughly 30–45 seconds.

## Schedule

Three slots, all IST:

| Cron (UTC) | IST | Why |
| --- | --- | --- |
| `30 3 * * *` | 09:00 | after the 08:00 image post |
| `0 9 * * *` | 14:30 | midday |
| `45 16 * * *` | 22:15 | night slot |

Each run takes the **newest published post that has no reel yet**, so a day with
three posts gets three different reels and a day with one post gets one reel —
the same post is never reeled twice. To change the cadence, edit the cron list
in `.github/workflows/social-reels.yml`.

## How the reel reaches the backend

Two paths, tried in order:

1. **Direct upload** — `POST /api/social/reel` with the scheduler key. Used when
   the repo secret is set.
2. **Repo inbox** — if the key is missing or the backend refuses it, the workflow
   drops `reel.mp4` + `inbox.json` into the `reel-inbox` release of this repo,
   and the backend's 5-minute social timer pulls it and publishes with its own
   credentials. Nothing secret leaves the deployment, and a rotated key cannot
   silently stop the reels.

The inbox is idempotent: a post that already has a reel is never published
twice, and a failing publish is retried at most 5 times before it is dropped.

## One-time setup (optional)

Direct upload needs the backend's scheduler key. Add it once as a repository
secret (Settings → Secrets and variables → Actions) — without it the repo inbox
takes over automatically:

| Secret | Value |
| --- | --- |
| `SCHEDULER_SECRET` | the same string as the backend's `SCHEDULER_SECRET` env var, or its `ADMIN_PORTAL_TOKEN` if that is what the deployment sets |

A `401` in the publish step means the key is missing or different. A `409` means
no video-capable channel is connected yet (Instagram / Facebook / Telegram /
YouTube in IMS → Social Media) — connect one and the next slot publishes.

## Manual run

Actions → **SSF Daily Reel** → Run workflow. Leave `post_id` empty to take the
newest un-reeled post, or pass a post id to force that one. The rendered MP4 is
kept as a build artifact for 7 days, so a bad reel can be checked before the
next slot.

## Seva reels — "मदद करने के हज़ार तरीके"

A second, independent series: each reel teaches one theme and **three concrete
ways a viewer can help today**, then asks for support.

```
hook   मदद करने के हज़ार तरीके / <theme> / तरीका #N
card 1 01  <way to help>   Hindi line + English gloss + the spoken detail
card 2 02  ...
card 3 03  ...
end    DONATE NOW · QR · UPI/Paytm 9718346691 · swastiksrijan.in/Donate
```

| Piece | Where |
| --- | --- |
| The 36 ways (12 groups of 3) | `backend_node/data/sevaIdeas.js` |
| Renderer | `scripts/make_seva_reel.py` |
| Schedule + inbox | `.github/workflows/seva-reels.yml` → release `seva-inbox` |
| End card (shared with the post reels) | `scripts/make_reel.py` → `end_card()` |

Add a way to help by editing `sevaIdeas.js` — nothing else changes. The group for
a day is `(day of year - 1) % 12`, so the series walks the whole list and then
repeats; pass `index` on a manual run to render a specific group.

### Why a separate inbox tag

The backend polls one inbox per series (`REEL_INBOX_TAGS`, default
`reel-inbox,seva-inbox`). A single shared manifest loses a reel whenever the free
instance is asleep and the next workflow run overwrites the manifest before it is
read, so each series keeps its own tag and its own state key.

A seva reel has no awareness post behind it, so the inbox creates the record
(`postRef` `SEVA-<date>-<index>`, slot `seva`) and then publishes it through the
same path as any other reel — the IMS Social list shows it with its per-platform
results.

### The ask comes last, and it is an offer

The order matters: every reel first tells the viewer what they can do **by
themselves** ("ये आप खुद भी कर सकते हैं / पैसा ज़रूरी नहीं, समय भी काफ़ी है"), and
only then offers the foundation as one way to do it ("— चाहें तो हमारे माध्यम से —").
The card never opens with a demand for money.

```
आप भी मदद करें · हर हाथ काम आता है
— चाहें तो हमारे माध्यम से —
QR (the foundation's own Paytm scanner)
QR स्कैन करें · Scan to pay
UPI  swastikstijanfoundation@ptyes
swastiksrijan.in/Donate
Razorpay · UPI · Card · NetBanking
```

The QR is the foundation's real Paytm scanner, cropped to the code and stored at
`backend_node/assets/donate-qr.png` — it encodes
`upi://pay?pa=swastikstijanfoundation@ptyes&pn=SWASTIK SRIJAN FOUNDATION SAMITI`.
Without that asset the card falls back to a generated QR for the donate page (needs
the `qrcode` package), so a missing file degrades instead of failing the render.

Change the VPA, the donate URL or the Razorpay link in one place: `UPI_ID`,
`DONATE_URL`, `RAZORPAY_URL` at the top of `scripts/make_reel.py`.
