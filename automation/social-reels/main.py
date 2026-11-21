#!/usr/bin/env python3
"""Build and upload MP4 Reels for already-published SSF social posts.

Uses only Python's standard library and the runner's FFmpeg binary. The existing
social scheduler remains the source of truth; this worker only consumes posts
that have already been published to Facebook or Instagram.
"""
import json
import os
import subprocess
import tempfile
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

BACKEND = (os.environ.get("BACKEND_URL") or "https://ngo-backend-03hq.onrender.com").rstrip("/")
KEY = os.environ.get("SCHEDULER_SECRET") or "ssf-admin-portal-token"
MAX_JOBS = int(os.environ.get("SOCIAL_REELS_BATCH", "4"))


def request_json(url, method="GET", data=None, headers=None):
    req = urllib.request.Request(url, data=data, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=120) as response:
            raw = response.read()
            return json.loads(raw.decode("utf-8")) if raw else {}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")
        raise RuntimeError(f"HTTP {exc.code}: {detail[:800]}") from exc


def download(url, target):
    req = urllib.request.Request(url, headers={"User-Agent": "SSF-Smart-Reel/1.0"})
    with urllib.request.urlopen(req, timeout=120) as response, open(target, "wb") as out:
        out.write(response.read())


def build_reel(image_path, output_path):
    # A branded 9:16 animated poster. The source social card remains legible in
    # the centre; the navy canvas fills the vertical frame without stretching it.
    cmd = [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-loop", "1", "-i", str(image_path),
        "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000",
        "-vf",
        "scale=1080:1920:force_original_aspect_ratio=decrease,"
        "pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x12345A,"
        "zoompan=z='min(zoom+0.0007,1.06)':d=450:s=1080x1920:fps=30,"
        "format=yuv420p",
        "-t", "15", "-r", "30",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
        "-c:a", "aac", "-b:a", "128k", "-ar", "48000",
        "-movflags", "+faststart", "-shortest", str(output_path),
    ]
    subprocess.run(cmd, check=True, timeout=180)


def upload_reel(post_id, video_path):
    boundary = "----SSFReelBoundary7MA4YWxkTrZu0gW"
    filename = f"ssf-reel-{post_id}.mp4"
    with open(video_path, "rb") as handle:
        video = handle.read()
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="video"; filename="{filename}"\r\n'
        "Content-Type: video/mp4\r\n\r\n"
    ).encode("utf-8") + video + f"\r\n--{boundary}--\r\n".encode("utf-8")
    url = f"{BACKEND}/api/social/reels/{urllib.parse.quote(str(post_id))}/publish?key={urllib.parse.quote(KEY)}"
    return request_json(url, method="POST", data=body, headers={
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "Content-Length": str(len(body)),
    })


def main():
    if not KEY:
        raise RuntimeError("SCHEDULER_SECRET is missing")
    if subprocess.run(["ffmpeg", "-version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode:
        raise RuntimeError("FFmpeg is not installed on this runner")

    manifest = request_json(f"{BACKEND}/api/social/reels/pending?key={urllib.parse.quote(KEY)}")
    jobs = (manifest.get("jobs") or [])[:MAX_JOBS]
    if not jobs:
        print("No pending SSF Reels.")
        return

    for job in jobs:
        post_id = job.get("postId")
        image_url = job.get("imageUrl")
        if not post_id or not image_url:
            print(f"Skipping invalid Reel job: {job}")
            continue
        try:
            with tempfile.TemporaryDirectory(prefix="ssf-reel-") as work:
                image_path = Path(work) / "post.jpg"
                video_path = Path(work) / "reel.mp4"
                download(image_url, image_path)
                build_reel(image_path, video_path)
                result = upload_reel(post_id, video_path)
                print(f"Post {post_id}: {json.dumps(result, ensure_ascii=False)}")
        except Exception as exc:
            print(f"Post {post_id}: Reel automation failed: {exc}")


if __name__ == "__main__":
    main()
