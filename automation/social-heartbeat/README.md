# SSF Social Publisher Heartbeat

Deterministic, no-LLM automation that pings the SSF backend's scheduler
endpoint so a due awareness post goes out on time:

    GET https://ngo-backend-03hq.onrender.com/api/social/cron?key=<ADMIN_PORTAL_TOKEN>

The endpoint is idempotent (a draft flips to published once), so extra pings
never duplicate a post.

It runs on a `*/5 * * * *` cron but only wakes the backend inside a short window
around each post slot (IST). Outside those windows it exits immediately without
a request, so the free Neon database can auto-suspend. Do not change this back
to an always-on ping: keeping Render awake 24x7 kept the Neon compute active
continuously and exhausted the free-tier 191.9 compute-hours/month, which broke
login/signup/form submission with "Server Error".

Env overrides: `SSF_BACKEND_URL`, `SSF_SCHEDULER_KEY`, `SSF_POST_SLOTS`,
`SSF_WAKE_BEFORE_MIN`, `SSF_WAKE_AFTER_MIN`, `SSF_TZ`.
