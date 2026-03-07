## Context

Memenator uses Astro DB with a local SQLite-compatible database at `.astro/content.db`. This database is ephemeral—recreated from seed data on every `npm run dev`. While convenient for rapid iteration, it prevents real usage during development and requires separate persistence planning for production.

The project already has `@astrojs/db` configured with Meme, Tag, and MemeTag tables. The existing schema and seed file provide the foundation for this change.

## Goals / Non-Goals

**Goals:**
- Data persists across `npm run dev` restarts
- Single `docker compose up` deploys the full stack
- Self-hosted solution with no external service dependencies
- Maintain existing Astro DB developer experience (same schema, queries, etc.)
- Works in both development and production modes

**Non-Goals:**
- Cloud database hosting (Turso, PlanetScale, etc.)
- Database clustering or replication
- Backup automation (can be added later)
- Migration tooling beyond initial setup

## Decisions

### 1. Use libSQL Server (sqld) for Persistence

**Decision**: Deploy `ghcr.io/tursodatabase/libsql-server` as the database backend.

**Alternatives Considered**:
- **PostgreSQL**: Requires schema migration, loses Astro DB integration
- **SQLite file mount**: No network access, complicates multi-container setup
- **Turso managed**: Violates self-hosted requirement

**Rationale**: libSQL is wire-compatible with Astro DB's remote mode. Zero schema changes needed. Official Docker image is maintained by Turso.

### 2. Docker Compose for Orchestration

**Decision**: Use Docker Compose with two services: `app` (Astro) and `db` (libSQL).

**Rationale**: Simplest self-hosted deployment. Single command to start everything. Volume persistence for database. Easy to extend later.

### 3. Environment-Based Configuration

**Decision**: Use `ASTRO_DB_REMOTE_URL` and `ASTRO_DB_APP_TOKEN` environment variables.

**Rationale**: Astro DB natively supports these variables for remote database connections. No code changes needed—just configuration.

### 4. Development Workflow

**Decision**: Run `docker compose up db` to start the database, then `npm run dev` connects to it.

**Rationale**: Preserves hot reload and dev tooling. Database container runs persistently. Alternative (full Docker for dev) loses hot reload benefits.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| libSQL server version drift | Pin Docker image to specific version tag |
| Auth token exposure | Use `.env` file excluded from git |
| Volume data loss | Document backup procedure |
| Port conflicts (8080) | Make port configurable via env var |
| Cold start on first run | Seed script runs automatically when tables are empty |
