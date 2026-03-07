# Memenator

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
