# SSF Social Publisher Heartbeat

Deterministic, no-LLM automation that pings the SSF backend every 5 minutes:

    GET https://ngo-backend-03hq.onrender.com/api/social/cron?key=<ADMIN_PORTAL_TOKEN>

This keeps the free Render instance awake 24x7 and publishes any due
morning/evening awareness post. The endpoint is idempotent (a draft flips to
published once), so extra pings never duplicate a post.

Deployed as an OpenHands automation (cron `*/5 * * * *`, timezone UTC,
entrypoint `python3 main.py`). Env overrides: `SSF_BACKEND_URL`,
`SSF_SCHEDULER_KEY`.
