## 1. Docker Configuration

- [x] 1.1 Create `Dockerfile` for Astro app with Node adapter
- [x] 1.2 Create `docker-compose.yml` with app and db services
- [x] 1.3 Configure libSQL service with `ghcr.io/tursodatabase/libsql-server` image
- [x] 1.4 Add named volume `memenator-db-data` for database persistence
- [x] 1.5 Configure health check for libSQL service
- [x] 1.6 Add `depends_on` with health condition for app service

## 2. Environment Configuration

- [x] 2.1 Create `.env.example` with `ASTRO_DB_REMOTE_URL` and `ASTRO_DB_APP_TOKEN`
- [x] 2.2 Add `.env` to `.gitignore`
- [x] 2.3 Configure Docker Compose to load from `.env` file
- [x] 2.4 Set default libSQL port and auth token variables

## 3. Astro Configuration

- [x] 3.1 Update `astro.config.mjs` to support remote database mode
- [x] 3.2 Verify existing db/config.ts schema works with remote libSQL
- [x] 3.3 Update db/seed.ts to handle already-seeded database gracefully

## 4. Development Workflow

- [x] 4.1 Add npm script `db:start` to run `docker compose up db -d`
- [x] 4.2 Add npm script `db:stop` to run `docker compose down`
- [x] 4.3 Document development workflow in README or comments

## 5. Testing & Verification

- [x] 5.1 Test `docker compose up db` starts libSQL server
- [x] 5.2 Test `npm run dev` connects to remote database
- [x] 5.3 Test meme upload persists after container restart
- [x] 5.4 Test full stack with `docker compose up`
- [x] 5.5 Verify data survives `docker compose down` and `up`
