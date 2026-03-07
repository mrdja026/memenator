## ADDED Requirements

### Requirement: libSQL server runs as Docker container

The system SHALL provide a libSQL server container using `ghcr.io/tursodatabase/libsql-server` image that accepts connections on a configurable port.

#### Scenario: Server starts successfully
- **WHEN** the libSQL container is started
- **THEN** it SHALL listen on the configured port (default 8080)
- **THEN** it SHALL accept HTTP connections for database operations

#### Scenario: Server accepts Astro DB connections
- **WHEN** Astro DB is configured with the libSQL server URL
- **THEN** all database queries SHALL execute against the remote server
- **THEN** existing Astro DB schema and queries SHALL work without modification

### Requirement: Database data persists across container restarts

The system SHALL store database files in a Docker volume that survives container restarts and recreations.

#### Scenario: Data survives container restart
- **WHEN** a meme is uploaded and saved to the database
- **WHEN** the libSQL container is stopped and started again
- **THEN** the previously saved meme SHALL still be queryable

#### Scenario: Data survives container recreation
- **WHEN** data exists in the database
- **WHEN** the container is removed and recreated with the same volume
- **THEN** all data SHALL be preserved

### Requirement: Authentication protects database access

The system SHALL support JWT-based authentication for database connections.

#### Scenario: Valid token allows access
- **WHEN** a request includes a valid auth token
- **THEN** the database SHALL process the request

#### Scenario: Missing token denies access
- **WHEN** authentication is enabled
- **WHEN** a request lacks an auth token
- **THEN** the database SHALL reject the request

### Requirement: Environment variables configure connection

The system SHALL use standard Astro DB environment variables for remote database configuration.

#### Scenario: Remote URL configures connection
- **WHEN** `ASTRO_DB_REMOTE_URL` is set
- **THEN** Astro DB SHALL connect to that URL instead of local database

#### Scenario: App token authenticates
- **WHEN** `ASTRO_DB_APP_TOKEN` is set
- **THEN** Astro DB SHALL include this token in database requests
