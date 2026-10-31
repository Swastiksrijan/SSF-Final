"""SSF social-publisher heartbeat.

Runs on the OpenHands automation service every few minutes and pings the SSF
backend's scheduler endpoint, which (a) wakes the free Render instance and
(b) publishes any due morning/evening post. Fully deterministic — no LLM.

The endpoint is idempotent, so extra pings never duplicate a post.

IMPORTANT — do not run this 24x7. The backend holds a persistent Postgres pool
and its own 5-minute timer queries the database on every tick, so pinging Render
around the clock keeps the Neon compute active continuously. That burned through
Neon's free-tier 191.9 compute-hours/month in about a week and surfaced as
"Server Error" on every login/signup/form. This script therefore wakes the
backend only inside a short window around each post slot (IST) and exits at once
otherwise, so Neon auto-suspends for the rest of the day. Keep POST_SLOTS in
step with the backend's "times" / "seriesTimes" / "courseTimes" config.
"""
import datetime
import json
import os
import urllib.error
import urllib.request
import zoneinfo

BACKEND = os.environ.get("SSF_BACKEND_URL", "https://ngo-backend-03hq.onrender.com").rstrip("/")
KEY = os.environ.get("SSF_SCHEDULER_KEY", "ssf-admin-portal-token")

# Post slots (HH:MM, IST) and how long before/after each one to keep Render
# awake. Defaults cover the daily awareness post (08:00), the awareness series,
# the course chapters and the twice-daily Join stream.
POST_SLOTS = [s.strip() for s in os.environ.get(
    "SSF_POST_SLOTS", "07:00 07:30 08:00 09:00 11:00 14:00 18:00 19:00 20:00 21:00"
).split() if s.strip()]
WAKE_BEFORE_MIN = int(os.environ.get("SSF_WAKE_BEFORE_MIN", "2"))
WAKE_AFTER_MIN = int(os.environ.get("SSF_WAKE_AFTER_MIN", "15"))
TZ = zoneinfo.ZoneInfo(os.environ.get("SSF_TZ", "Asia/Kolkata"))


def in_window(now=None):
    now = now or datetime.datetime.now(TZ)
    minutes = now.hour * 60 + now.minute
    for slot in POST_SLOTS:
        try:
            hh, mm = (int(x) for x in slot.split(":"))
        except ValueError:
            continue
        slot_min = hh * 60 + mm
        if slot_min - WAKE_BEFORE_MIN <= minutes <= slot_min + WAKE_AFTER_MIN:
            return True
    return False


def fire_callback(status="COMPLETED", error=None):
    url = os.environ.get("AUTOMATION_CALLBACK_URL", "")
    if not url:
        return
    body = {"status": status, "run_id": os.environ.get("AUTOMATION_RUN_ID", "")}
    if error:
        body["error"] = error
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode(),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {os.environ.get('AUTOMATION_CALLBACK_API_KEY', '')}",
        },
    )
    try:
        urllib.request.urlopen(req, timeout=15)
    except Exception as exc:  # non-fatal
        print(f"Callback error (non-fatal): {exc}")


def ping():
    # Warm-up first: the free Render instance may be cold-starting.
    try:
        urllib.request.urlopen(f"{BACKEND}/", timeout=90)
    except Exception:
        pass

    url = f"{BACKEND}/api/social/cron?key={KEY}"
    last = None
    for attempt in range(4):
        try:
            with urllib.request.urlopen(url, timeout=120) as resp:
                body = resp.read().decode()
                print(f"HTTP {resp.status}: {body[:400]}")
                return True
        except urllib.error.HTTPError as exc:
            last = f"HTTPError {exc.code}"
            print(f"attempt {attempt + 1}: {last}")
        except Exception as exc:
            last = str(exc)
            print(f"attempt {attempt + 1}: {last}")
    raise RuntimeError(f"social cron unreachable: {last}")


def main():
    if not in_window():
        now = datetime.datetime.now(TZ)
        print(f"Outside every post window ({now:%H:%M} IST) — not waking the backend.")
        fire_callback("COMPLETED")
        return
    try:
        ping()
        fire_callback("COMPLETED")
    except Exception as exc:
        fire_callback("FAILED", str(exc))
        raise


if __name__ == "__main__":
    main()
