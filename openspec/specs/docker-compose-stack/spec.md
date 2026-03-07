# docker-compose-stack

Full Docker Compose setup for Astro app + libSQL server, ready for self-hosting.

## Requirements

### Requirement: Docker Compose defines the full stack

The system SHALL provide a `docker-compose.yml` file that defines both the Astro application and libSQL database services.

#### Scenario: Single command starts everything
- **WHEN** user runs `docker compose up`
- **THEN** both the Astro app and libSQL database SHALL start
- **THEN** the Astro app SHALL be accessible on its configured port

#### Scenario: Services can start independently
- **WHEN** user runs `docker compose up db`
- **THEN** only the libSQL database SHALL start
- **THEN** local `npm run dev` SHALL be able to connect to it

### Requirement: Astro application is containerized

The system SHALL provide a Dockerfile for the Astro application using the Node adapter for SSR.

#### Scenario: Container builds successfully
- **WHEN** user runs `docker compose build`
- **THEN** the Astro application image SHALL build without errors

#### Scenario: Container runs in production mode
- **WHEN** the app container starts
- **THEN** it SHALL run the built Astro application
- **THEN** it SHALL connect to the libSQL database using environment variables

### Requirement: Database service uses persistent volume

The system SHALL configure the libSQL service with a named volume for data persistence.

#### Scenario: Volume is created automatically
- **WHEN** `docker compose up` runs for the first time
- **THEN** a named volume SHALL be created for database storage

#### Scenario: Volume persists data
- **WHEN** containers are stopped with `docker compose down`
- **THEN** the volume SHALL retain all database data
- **THEN** restarting with `docker compose up` SHALL restore access to existing data

### Requirement: Environment file configures secrets

The system SHALL support a `.env` file for sensitive configuration values.

#### Scenario: Env file is loaded
- **WHEN** a `.env` file exists in the project root
- **THEN** Docker Compose SHALL load variables from it

#### Scenario: Example env file is provided
- **WHEN** the project is cloned
- **THEN** a `.env.example` file SHALL document required variables
- **THEN** `.env` SHALL be excluded from git

### Requirement: Services have health checks

The system SHALL configure health checks for service readiness.

#### Scenario: Database health is monitored
- **WHEN** the libSQL container is running
- **THEN** Docker SHALL periodically verify the database is accepting connections

#### Scenario: App waits for database
- **WHEN** the app container starts
- **THEN** it SHALL wait for the database health check to pass before accepting traffic

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
