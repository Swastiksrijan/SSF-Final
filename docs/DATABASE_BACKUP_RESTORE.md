# SSF database backup and restore

## What this workflow does

- Runs daily at 07:00 India time, and can also be started manually.
- Exports the primary Neon PostgreSQL database using PostgreSQL custom format.
- Checks that the dump can be read, encrypts it with AES-256-CBC/PBKDF2, and uploads only the encrypted file as a GitHub Actions artifact.
- Keeps each encrypted artifact for 7 days. The backup is not stored in the public Git repository.
- If the required secrets are missing, the workflow safely skips without connecting to the database.

## One-time setup

In GitHub, open **Settings → Secrets and variables → Actions → New repository secret** and add:

1. `NEON_DATABASE_URL`: the **direct** connection string for the production Neon database (not the pooled connection string). In Neon Console, select the primary project and copy the connection string with SSL required. Never put this value in source code or a public issue.
2. `BACKUP_ENCRYPTION_KEY`: a unique, long random password (at least 32 random bytes/64 hex characters). Generate it locally with `openssl rand -hex 32` if OpenSSL is available. Store it safely in a password manager. Do not send it in chat or commit it to GitHub.

The encryption key is essential: without it, the encrypted backup cannot be restored. Keep a secure copy separate from GitHub.

## Verify

After the secrets are saved, open **Actions → Encrypted Neon Database Backup → Run workflow**. A successful run should create an artifact named `ssf-neon-db-backup-<run-id>`. Download the artifact and keep it secure. The scheduled run is daily at 07:00 IST.

## Restore (only when needed)

1. Download the encrypted artifact from the successful workflow run.
2. On a trusted computer with OpenSSL and PostgreSQL 17 client tools installed, decrypt it:
   ```bash
   openssl enc -d -aes-256-cbc -pbkdf2 -iter 600000 -in ssf-db.dump.enc -out ssf-db.dump -pass env:BACKUP_ENCRYPTION_KEY
   ```
   Set `BACKUP_ENCRYPTION_KEY` in your local terminal environment first; do not put the key directly in shell history.
3. Inspect the dump before restoring:
   ```bash
   pg_restore --list ssf-db.dump
   ```
4. Restore to a **separate test database first**. Only restore to production after verifying the backup and planning the recovery. A restore can overwrite or replace database objects.

Example restore to an empty test database:
```bash
pg_restore --no-owner --no-acl --dbname="$TARGET_DATABASE_URL" ssf-db.dump
``

## Important limits

- This is an encrypted rolling backup with 7-day retention, not permanent archival.
- GitHub Actions artifacts are a secondary copy, not a database replica. Keep the encryption key safe and periodically test restoration.
- The public repository contains only this workflow and instructions; database contents and secrets are never committed.
- GitHub Free has finite artifact storage. If the artifact quota is reached, the upload will fail; check the Actions run after setup.
- Neon Free's built-in instant restore is a separate short-window recovery feature and is not a substitute for an independent backup.
