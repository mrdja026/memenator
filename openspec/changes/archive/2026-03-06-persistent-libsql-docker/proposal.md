## Why

The local Astro DB (`.astro/content.db`) is recreated on every `npm run dev`, losing all uploaded memes and tags between sessions. This forces reliance on seed data and makes real usage impossible during development. A self-hosted, persistent database enables true data persistence while keeping the app fully self-hosted and dockerizable.

## What Changes

- Add libSQL server (sqld) as a Docker container for persistent database storage
- Configure Astro DB to connect to the external libSQL server instead of local ephemeral DB
- Create Docker Compose setup for both the Astro app and libSQL server
- Add environment-based database configuration for dev/prod flexibility
- Ensure uploaded memes, tags, and relationships persist across restarts

## Capabilities

### New Capabilities
- `libsql-persistence`: Self-hosted libSQL server with Docker, volume persistence, and Astro DB integration
- `docker-compose-stack`: Full Docker Compose setup for Astro app + libSQL server, ready for self-hosting

### Modified Capabilities

## Impact

- **Dependencies**: No new npm dependencies (Astro DB already supports remote libSQL)
- **Configuration**: New environment variables for database URL and auth token
- **Docker**: New `docker-compose.yml` and `Dockerfile` for the stack
- **Development**: `npm run dev` will connect to persistent libSQL container
- **Deployment**: Single `docker compose up` deploys the entire stack
