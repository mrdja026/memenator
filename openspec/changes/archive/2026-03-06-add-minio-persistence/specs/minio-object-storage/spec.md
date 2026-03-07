## ADDED Requirements

### Requirement: MinIO stores uploaded media files

The system SHALL upload all media files (images and videos) to MinIO object storage instead of the local filesystem.

#### Scenario: Image upload saves to MinIO
- **WHEN** a user uploads an image file
- **THEN** the file SHALL be stored in the MinIO `memenator-media` bucket
- **THEN** the file key SHALL be a UUID with the original file extension

#### Scenario: Video upload saves to MinIO
- **WHEN** a user uploads a video file
- **THEN** the file SHALL be stored in the MinIO `memenator-media` bucket
- **THEN** the file key SHALL be a UUID with the original file extension

### Requirement: Files are accessible via presigned URLs

The system SHALL generate presigned URLs for accessing stored files.

#### Scenario: Presigned URL generated for display
- **WHEN** a meme is requested for display
- **THEN** the system SHALL generate a presigned URL for the media file
- **THEN** the URL SHALL expire after 24 hours

#### Scenario: Expired URL returns error
- **WHEN** a presigned URL has expired
- **THEN** the request SHALL return a 403 Forbidden response

### Requirement: File deletion removes from MinIO

The system SHALL delete files from MinIO when memes are deleted.

#### Scenario: Meme deletion removes file
- **WHEN** a meme is deleted from the system
- **THEN** the associated file SHALL be removed from MinIO

#### Scenario: Missing file deletion succeeds gracefully
- **WHEN** a meme is deleted but the file does not exist in MinIO
- **THEN** the deletion SHALL complete without error

### Requirement: MinIO bucket is created automatically

The system SHALL ensure the required bucket exists on startup.

#### Scenario: Bucket created on first run
- **WHEN** the application starts
- **WHEN** the `memenator-media` bucket does not exist
- **THEN** the system SHALL create the bucket

#### Scenario: Existing bucket is reused
- **WHEN** the application starts
- **WHEN** the `memenator-media` bucket already exists
- **THEN** the system SHALL use the existing bucket without error

### Requirement: MinIO connection uses environment variables

The system SHALL configure MinIO connection using environment variables.

#### Scenario: Custom endpoint configuration
- **WHEN** `MINIO_ENDPOINT` environment variable is set
- **THEN** the system SHALL connect to that MinIO endpoint

#### Scenario: Credentials from environment
- **WHEN** `MINIO_ACCESS_KEY` and `MINIO_SECRET_KEY` are set
- **THEN** the system SHALL authenticate using those credentials
