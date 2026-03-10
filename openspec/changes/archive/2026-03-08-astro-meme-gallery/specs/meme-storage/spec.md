## ADDED Requirements

### Requirement: Meme creation with metadata
The system SHALL store memes with associated metadata: title, description, tags, file path, and upload timestamp.

#### Scenario: Create meme with all fields
- **WHEN** user confirms upload with title, description, and tags
- **THEN** system stores the meme file and creates a metadata record with all fields

#### Scenario: Create meme with minimal fields
- **WHEN** user confirms upload with only a title (no description or tags)
- **THEN** system stores the meme with empty description and no tags

### Requirement: Unique meme identifiers
The system SHALL assign a unique identifier to each meme for reliable retrieval.

#### Scenario: Generated unique ID
- **WHEN** a new meme is created
- **THEN** system assigns a unique ID that does not conflict with existing memes

### Requirement: Media file persistence
The system SHALL store uploaded media files in a persistent location accessible by the web server.

#### Scenario: File stored in uploads directory
- **WHEN** user confirms a meme upload
- **THEN** system saves the file to the uploads directory with a unique filename

#### Scenario: Original format preserved
- **WHEN** user uploads a GIF or MP4
- **THEN** system stores the file without converting to a different format

### Requirement: Meme retrieval
The system SHALL provide retrieval of memes ordered by upload date (newest first).

#### Scenario: Retrieve all memes
- **WHEN** gallery page loads
- **THEN** system returns all memes sorted by upload timestamp descending

#### Scenario: Retrieve recent memes for sidebar
- **WHEN** sidebar component loads
- **THEN** system returns the most recent memes (limited count) for display

### Requirement: Meme deletion
The system SHALL allow deletion of memes, removing both the file and metadata.

#### Scenario: Delete existing meme
- **WHEN** user deletes a meme
- **THEN** system removes the media file and metadata record

#### Scenario: Delete removes from tag associations
- **WHEN** user deletes a meme that has tags
- **THEN** system removes the meme from all tag associations
