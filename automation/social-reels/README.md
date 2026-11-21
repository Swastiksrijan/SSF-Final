# SSF Smart Reel Automation

This is an additive worker for the existing IMS Social Media Publisher.

## Flow

1. The existing Social Publisher continues creating and publishing its normal image posts.
2. The protected `GET /api/social/reels/pending` endpoint finds already-published posts and creates an idempotent Reel job in the existing `SocialConfig` table.
3. The existing GitHub Actions social-publisher workflow invokes this worker after a successful scheduler heartbeat.
4. The worker downloads the post's existing social artwork and uses FFmpeg to create a 15-second MP4 in 9:16 portrait format with H.264 video and AAC audio (silent audio track; no copyrighted music is added).
5. The worker uploads the MP4 to the backend. The backend uses the saved Page and Instagram credentials to publish through Meta's Page Video Reels and Instagram Reels APIs.
6. Results are recorded per platform. Successful platforms are never re-published on retry; failed platforms can be retried up to three times.

## Safety boundaries

- The existing image-post adapters and scheduler logic are not replaced.
- Reels are generated only from posts already published to Facebook or Instagram.
- Meta access tokens stay in the backend and are never sent to GitHub Actions.
- The temporary public MP4 URL is random, short-lived, and removed after Meta finishes processing.
- A job is idempotent per SocialPost ID.
- The workflow reuses the existing `SCHEDULER_SECRET` and `SOCIAL_BACKEND_URL` secrets.
- No paid AI/video API is used. GitHub Actions minutes and the backend's existing hosting limits still apply.

## Requirements before enabling

1. The existing Facebook channel must be connected and enabled with a Page access token that has the Page video publishing permissions (including `pages_manage_posts`, `pages_read_engagement`, and `pages_show_list`).
2. Instagram must be a linked Professional account and connected with the required content-publishing permission.
3. The backend must be publicly reachable at `PUBLIC_BASE_URL` (or the documented backend default), because Instagram fetches the MP4 from a public URL.
4. GitHub Actions must be enabled for the repository and the existing scheduler secrets must be configured.
5. The runner must have FFmpeg. The workflow installs it only if it is not already present.

## API endpoints

- `GET /api/social/reels/pending?key=...` — protected worker manifest.
- `POST /api/social/reels/:postId/publish?key=...` — protected multipart MP4 upload and publish.
- `GET /api/social/reels/media/:filename` — temporary public media URL fetched by Instagram.

## First-run validation

1. Merge and deploy this feature branch only after reviewing the pull request.
2. Confirm Facebook and Instagram image posts are still publishing as before.
3. Trigger the social-publisher workflow manually or wait for the next scheduled post window.
4. Confirm a Reel job reaches `published` in the worker response and appears on both connected Meta destinations.
5. If Meta returns a permissions or account-type error, fix the Meta app/Page permission first; do not repeatedly regenerate the video.

## Current video template

The first version animates the existing SSF social artwork into a branded 1080×1920 vertical MP4. It deliberately does not invent a voice, background track, people, or programme footage. A later iteration can add verified SSF photographs, Hindi/English narration, and approved royalty-free audio without changing the publishing queue.
