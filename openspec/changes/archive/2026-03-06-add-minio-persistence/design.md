## Context

The Memenator application currently stores uploaded media files directly in `public/uploads/` using Node.js filesystem APIs. While the database (libSQL) is properly persisted via Docker volumes, media files are lost when the app container is recreated. This creates a split persistence problem for Docker deployments.

The existing architecture:
- **Database**: libSQL container with volume persistence (metadata: titles, descriptions, tags)
- **Files**: Local filesystem in app container (not persisted)
- **API**: Astro API routes handle uploads, save to disk, return `/uploads/filename` URLs

## Goals / Non-Goals

**Goals:**
- Persist media files independently of the app container using MinIO
- Maintain S3-compatible storage for potential cloud migration
- Keep the existing user experience and API contracts unchanged
- Single `docker compose up` starts the complete stack

**Non-Goals:**
- Cloud S3 integration (local MinIO only for now)
- CDN or caching layer for media delivery
- Image processing or thumbnail generation
- Changing the database schema or metadata storage

## Decisions

### Decision 1: MinIO for object storage

**Choice**: Use MinIO as a self-hosted S3-compatible object store.

**Alternatives considered**:
- **Docker volume mount for uploads**: Simpler but couples storage to host filesystem, no S3 compatibility
- **Seaweed FS**: More complex, overkill for single-node deployment
- **Direct S3**: Requires cloud account, not self-hosted

**Rationale**: MinIO provides S3 API compatibility, excellent Docker support, web console for debugging, and easy migration path to cloud S3 if needed later.

### Decision 2: AWS SDK for S3 client

**Choice**: Use `@aws-sdk/client-s3` npm package.

**Alternatives considered**:
- **minio npm package**: MinIO-specific, less maintained than AWS SDK
- **aws-sdk v2**: Deprecated, larger bundle size

**Rationale**: AWS SDK v3 is modular (smaller bundles), well-maintained, and works with any S3-compatible service including MinIO. Makes future cloud migration seamless.

### Decision 3: Presigned URLs for file access

**Choice**: Generate presigned URLs for uploaded files with 24-hour expiry.

**Alternatives considered**:
- **Public bucket**: Security risk, no access control
- **Proxy through app**: Adds latency, increases server load

**Rationale**: Presigned URLs allow direct browser access to MinIO while maintaining security. 24-hour expiry balances security and caching.

### Decision 4: Single bucket with UUID-based keys

**Choice**: One bucket `memenator-media` with keys like `{uuid}.{ext}`.

**Alternatives considered**:
- **Multiple buckets by type**: Adds complexity without benefit at current scale
- **Date-based paths**: Complicates key generation and lookups

**Rationale**: Simple key structure matches existing filename generation. Single bucket reduces configuration.

### Decision 5: Store MinIO URL in database

**Choice**: Store the S3 key (not full URL) in the `filePath` column.

**Rationale**: Keys are stable; URLs can be regenerated. Allows endpoint changes without database migration.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| MinIO container failure loses files | Named volume `memenator-minio-data` persists data |
| Presigned URL expiry breaks cached pages | 24-hour expiry + client-side reload on 403 |
| Increased complexity vs filesystem | Documented setup, health checks ensure dependencies |
| Local development requires MinIO | Provide `docker compose up minio` for dev mode |
| AWS SDK adds bundle size | Tree-shaking + only importing S3 client module |
