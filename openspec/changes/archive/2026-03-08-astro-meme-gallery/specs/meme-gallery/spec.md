## ADDED Requirements

### Requirement: Main gallery display
The system SHALL display memes in a main content area with full details: large media preview, title, description, and all tag pills.

#### Scenario: Gallery shows meme cards
- **WHEN** user views the gallery page
- **THEN** system displays memes as cards with media, title, description, and tags

#### Scenario: Gallery sorted by date
- **WHEN** gallery loads
- **THEN** memes are displayed in reverse chronological order (newest first)

### Requirement: Media display in gallery
The system SHALL display images at a larger size and videos with playback controls.

#### Scenario: Image display
- **WHEN** a meme card contains an image
- **THEN** system displays the image at full card width

#### Scenario: Video display
- **WHEN** a meme card contains a video
- **THEN** system displays a video player with play/pause controls

#### Scenario: GIF animation
- **WHEN** a meme card contains a GIF
- **THEN** system displays the GIF with animation playing

### Requirement: Sidebar recent memes
The system SHALL display a sidebar showing the most recent memes with thumbnail previews.

#### Scenario: Sidebar shows recent uploads
- **WHEN** page loads
- **THEN** sidebar displays thumbnails of most recent memes

#### Scenario: Click sidebar thumbnail
- **WHEN** user clicks a sidebar thumbnail
- **THEN** system scrolls to or highlights that meme in the main gallery

### Requirement: Tag filter via pill click
The system SHALL filter gallery contents when user clicks a tag pill.

#### Scenario: Filter by single tag
- **WHEN** user clicks a tag pill in the gallery
- **THEN** system displays only memes that have that tag

#### Scenario: Clear tag filter
- **WHEN** user clicks the active filter tag or clear button
- **THEN** system removes the filter and shows all memes

#### Scenario: Filter persists navigation
- **WHEN** user has an active tag filter
- **THEN** sidebar and gallery both reflect the filtered results

### Requirement: Upload form in sidebar
The system SHALL display the upload form/dropzone in the sidebar for quick access.

#### Scenario: Sidebar contains upload zone
- **WHEN** page loads
- **THEN** sidebar displays the upload dropzone above recent memes

#### Scenario: Successful upload updates views
- **WHEN** user completes an upload via sidebar
- **THEN** new meme appears at top of gallery and sidebar recent list

### Requirement: Empty state handling
The system SHALL display helpful messaging when no memes exist.

#### Scenario: No memes uploaded
- **WHEN** gallery loads with no memes in storage
- **THEN** system displays a message encouraging first upload

#### Scenario: No memes match filter
- **WHEN** tag filter matches no memes
- **THEN** system displays a message indicating no results for that tag
