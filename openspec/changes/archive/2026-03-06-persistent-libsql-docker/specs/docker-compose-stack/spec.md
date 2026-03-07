## ADDED Requirements

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
