# Memenator

A local depoloyed container with minio that can store memes with minimal search.
Copy paste coming soon, or share may be cute.

A meme gallery built with Astro, libSQL database, and MinIO object storage.

## Architecture

- **Astro** - SSR web application
- **libSQL** - SQLite-compatible database for metadata (titles, descriptions, tags)
- **MinIO** - S3-compatible object storage for media files (images, videos)

## Prerequisites

- Node.js 22+
- Docker & Docker Compose

## Quick Start (Docker)

Run the full stack with a single command:

```bash
docker compose up -d
```

This starts:
- **App** at http://localhost:4321
- **MinIO Console** at http://localhost:9001 (login: minioadmin/minioadmin)
- **libSQL** at http://localhost:8080

Push the database schema on first run:

```bash
ASTRO_DB_REMOTE_URL=http://localhost:8080 npm run db:push
```

Stop everything:

```bash
docker compose down
```

Data persists in Docker volumes. To reset completely:

```bash
docker compose down -v
```

## Development Setup

### 1. Start services

```bash
docker compose up -d minio db
```

This starts MinIO and libSQL containers with persistent storage.

### 2. Configure environment

```bash
cp .env.example .env
```

Default values work for local development.

### 3. Push database schema

```bash
npm run db:push
```

### 4. Start development server

```bash
npm run dev:remote
```

This connects to the libSQL and MinIO containers, so your data persists across restarts.

### 5. Stop services

```bash
npm run db:stop
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ASTRO_DB_REMOTE_URL` | libSQL connection URL | `http://localhost:8080` |
| `MINIO_ENDPOINT` | MinIO API endpoint | `http://localhost:9000` |
| `MINIO_ACCESS_KEY` | MinIO access key | `minioadmin` |
| `MINIO_SECRET_KEY` | MinIO secret key | `minioadmin` |
| `MINIO_BUCKET` | Bucket name for media | `memenator-media` |
| `IMGBB_API_KEY` | ImgBB API key for sharing | (optional) |

## Sharing Memes

Memenator supports sharing memes via [ImgBB](https://imgbb.com/), a free image hosting service.

### Setup

1. Get a free API key at https://api.imgbb.com/
2. Add it to your `.env` file:
   ```bash
   IMGBB_API_KEY=your_api_key_here
   ```
3. Restart the app container (see below)

### Usage

Click the share button (next to delete) on any meme card. The meme will be uploaded to ImgBB and you'll get a shareable link with a copy button.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev with ephemeral database |
| `npm run dev:remote` | Local dev with persistent libSQL + MinIO |
| `npm run db:start` | Start libSQL container |
| `npm run db:stop` | Stop containers |
| `npm run db:push` | Push schema to remote database |
| `npm run build` | Build for production |

## Storage

- **Media files** (images, videos) are stored in MinIO with presigned URLs for access
- **Metadata** (titles, descriptions, tags) are stored in libSQL
- Both use Docker volumes for persistence across restarts

## Network Access

The app is configured to be accessible from other devices on your local network.

### Find Your IP Address

```bash
# Linux/macOS
hostname -I
# or
ip a | grep inet

# Windows
ipconfig
```

Look for an IP like `192.168.x.x` or `10.0.x.x`.

### Access from Another Device

Open a browser on any device on the same network and go to:

```
http://<YOUR_IP>:4321
```

For example: `http://192.168.1.50:4321`

### Firewall (Linux)

If you can't connect, allow ports through the firewall:

```bash
sudo ufw allow 4321  # App
sudo ufw allow 9000  # MinIO
```

### Configure for Network Access

Update `.env` with your machine's IP:

```bash
MINIO_ENDPOINT=http://YOUR_IP:9000
```

## Production Deployment (Docker)

Deploy the full stack with Docker Compose:

```bash
# 1. Update .env with your IP for network access
sed -i 's|MINIO_ENDPOINT=.*|MINIO_ENDPOINT=http://YOUR_IP:9000|' .env

# 2. Build and start all services
docker compose up -d --build

# 3. Push database schema (first time only)
docker compose exec app npm run db:push
```

The app will be available at `http://YOUR_IP:4321` from any device on your network.

### Manage Production

```bash
# View logs
docker compose logs -f app

# Restart services (preserves data)
docker compose restart

# Restart with rebuild (after code changes, preserves data)
docker compose up -d --build

# Stop all services (preserves data)
docker compose down

# Update and rebuild
git pull && docker compose up -d --build

# DANGER: Remove all data
docker compose down -v
```

### Restart Without Data Loss

Data is stored in Docker volumes (`memenator-db-data` and `memenator-minio-data`) which persist across restarts.

**Quick restart (after code changes):**

```bash
docker compose build app && docker compose up -d app
```

**Safe commands** (data preserved):
- `docker compose restart` - Quick restart (no rebuild)
- `docker compose down && docker compose up -d` - Full restart
- `docker compose up -d --build` - Rebuild and restart all services
- `docker compose build app && docker compose up -d app` - Rebuild and restart app only

**Dangerous command** (data deleted):
- `docker compose down -v` - Removes volumes and all data
