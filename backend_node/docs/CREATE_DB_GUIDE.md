# How to Create a Database in pgAdmin

1.  **Open pgAdmin** (It may take a moment to load and ask for your master password).
2.  In the left sidebar (Browser), click on **Servers** > **PostgreSQL** > **Databases**.
3.  **Right-click** on **Databases** > **Create** > **Database...**
4.  In the naming window:
    - **Database**: Enter `swf_ngo_db` (or whatever name you like).
    - **Owner**: Leave as default (usually `postgres`).
5.  Click **Save**.

### Next Step: Update your `.env` file

Open your `.env` file in VS Code (`backend_node/.env`) and update it to match what you just did:

```env
PORT=5000
# ... other keys ...
DB_NAME=swf_ngo_db
DB_USER=postgres
DB_PASS=YOUR_PGADMIN_PASSWORD
DB_HOST=localhost
```

(Replace `YOUR_PGADMIN_PASSWORD` with the password you use to log in to pgAdmin).
