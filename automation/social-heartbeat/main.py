"""SSF social-publisher heartbeat.

Runs on the OpenHands automation service every few minutes and pings the SSF
backend's scheduler endpoint, which (a) wakes the free Render instance and
(b) publishes any due morning/evening post. Fully deterministic — no LLM.

The endpoint is idempotent, so extra pings never duplicate a post.
"""
import json
import os
import urllib.error
import urllib.request

BACKEND = os.environ.get("SSF_BACKEND_URL", "https://ngo-backend-03hq.onrender.com").rstrip("/")
KEY = os.environ.get("SSF_SCHEDULER_KEY", "ssf-admin-portal-token")


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
    try:
        ping()
        fire_callback("COMPLETED")
    except Exception as exc:
        fire_callback("FAILED", str(exc))
        raise


if __name__ == "__main__":
    main()
