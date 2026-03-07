## 1. Docker Compose Setup

- [x] 1.1 Add MinIO service to `docker-compose.yml` with ports 9000 (API) and 9001 (console)
- [x] 1.2 Create named volume `memenator-minio-data` for MinIO persistence
- [x] 1.3 Add MinIO health check configuration
- [x] 1.4 Add MinIO environment variables (MINIO_ROOT_USER, MINIO_ROOT_PASSWORD)
- [x] 1.5 Update app service to depend on MinIO health check
- [x] 1.6 Add MinIO connection environment variables to app service

## 2. Environment Configuration

- [x] 2.1 Add MinIO variables to `.env.example` (MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY)
- [x] 2.2 Update `.gitignore` if needed for MinIO credentials

## 3. Dependencies

- [x] 3.1 Install `@aws-sdk/client-s3` package

## 4. MinIO Client Implementation

- [x] 4.1 Create `src/lib/minio.ts` with S3 client configuration
- [x] 4.2 Implement `ensureBucket()` function to create bucket if not exists
- [x] 4.3 Implement `uploadFile()` function to store files in MinIO
- [x] 4.4 Implement `getPresignedUrl()` function to generate signed URLs
- [x] 4.5 Implement `deleteFile()` function to remove files from MinIO

## 5. File Service Migration

- [x] 5.1 Update `src/lib/files.ts` to use MinIO functions instead of filesystem
- [x] 5.2 Update `saveUploadedFile()` to call MinIO upload
- [x] 5.3 Update `deleteUploadedFile()` to call MinIO delete
- [x] 5.4 Add function to get presigned URL for file path

## 6. API Route Updates

- [x] 6.1 Update upload API route to use new MinIO-based file functions
- [x] 6.2 Update meme retrieval to generate presigned URLs for file access
- [x] 6.3 Update delete API route to use MinIO delete function

## 7. Application Startup

- [x] 7.1 Add bucket initialization on app startup
- [x] 7.2 Add MinIO connection validation on startup

## 8. Testing

- [x] 8.1 Verify `docker compose up` starts all services including MinIO
- [x] 8.2 Test file upload stores in MinIO bucket
- [x] 8.3 Test file retrieval via presigned URL
- [x] 8.4 Test file deletion removes from MinIO
- [x] 8.5 Test data persists after `docker compose down` and `up`
