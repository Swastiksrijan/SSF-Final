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

## One-time setup

The publish step needs the backend's scheduler key. Add it once as a repository
secret (Settings → Secrets and variables → Actions):

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
