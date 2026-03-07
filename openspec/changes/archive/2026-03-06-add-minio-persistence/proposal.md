## Why

Currently, uploaded images and videos are stored in `public/uploads/` on the filesystem. In Docker deployments, this data is lost when containers are recreated. MinIO provides S3-compatible object storage that persists media files independently of the application container, while the existing libSQL database continues to handle metadata.

## What Changes

- Add MinIO service to `docker-compose.yml` with persistent volume storage
- Replace filesystem-based file storage (`src/lib/files.ts`) with MinIO S3 client
- Store media files (images, videos) in MinIO buckets
- Keep meme metadata (title, description, tags) in the existing libSQL database
- Update API routes to generate MinIO URLs for file access
- Add MinIO environment configuration variables

## Capabilities

### New Capabilities
- `minio-object-storage`: S3-compatible object storage for media files using MinIO, integrated into Docker Compose with persistent volumes and bucket management

### Modified Capabilities
- `docker-compose-stack`: Add MinIO service with health checks, volumes, and network configuration

## Impact

- **Code changes**: `src/lib/files.ts` rewritten to use MinIO SDK instead of filesystem
- **API changes**: File URLs will point to MinIO instead of `/uploads/` path
- **Dependencies**: Add `@aws-sdk/client-s3` or `minio` npm package
- **Docker**: New MinIO service container, new volume for object data
- **Environment**: New `MINIO_*` environment variables for credentials and endpoint
