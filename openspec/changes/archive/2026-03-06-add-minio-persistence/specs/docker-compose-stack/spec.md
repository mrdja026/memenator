## ADDED Requirements

### Requirement: MinIO service is defined in Docker Compose

The system SHALL include a MinIO service in `docker-compose.yml` that provides S3-compatible object storage.

#### Scenario: MinIO starts with compose
- **WHEN** user runs `docker compose up`
- **THEN** the MinIO service SHALL start alongside the app and database
- **THEN** MinIO console SHALL be accessible on port 9001

#### Scenario: MinIO API is accessible
- **WHEN** MinIO container is running
- **THEN** the S3 API SHALL be accessible on port 9000

### Requirement: MinIO data persists in Docker volume

The system SHALL store MinIO data in a named Docker volume.

#### Scenario: Volume preserves uploaded files
- **WHEN** a file is uploaded to MinIO
- **WHEN** containers are stopped with `docker compose down`
- **WHEN** containers are restarted with `docker compose up`
- **THEN** the previously uploaded file SHALL still be accessible

#### Scenario: Volume survives container recreation
- **WHEN** the MinIO container is removed and recreated
- **THEN** all stored files SHALL be preserved

### Requirement: MinIO has health check

The system SHALL configure a health check for the MinIO service.

#### Scenario: Health check monitors MinIO
- **WHEN** MinIO container is running
- **THEN** Docker SHALL periodically verify MinIO is accepting connections

#### Scenario: App waits for MinIO
- **WHEN** the app container starts
- **THEN** it SHALL wait for MinIO health check to pass before starting

### Requirement: MinIO credentials are configurable

The system SHALL support configuring MinIO credentials via environment variables.

#### Scenario: Default credentials for development
- **WHEN** no credentials are specified in `.env`
- **THEN** MinIO SHALL use default root credentials from docker-compose

#### Scenario: Custom credentials from env file
- **WHEN** `MINIO_ROOT_USER` and `MINIO_ROOT_PASSWORD` are set in `.env`
- **THEN** MinIO SHALL use those credentials
