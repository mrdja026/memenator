## ADDED Requirements

### Requirement: Tag persistence
The system SHALL maintain a persistent list of all tags that have been used.

#### Scenario: New tag added to list
- **WHEN** user adds a tag that does not exist in the system
- **THEN** system creates the tag and adds it to the available tags list

#### Scenario: Existing tag reused
- **WHEN** user selects an existing tag
- **THEN** system associates the tag without creating a duplicate

### Requirement: Tag autocomplete
The system SHALL suggest existing tags as the user types in the tag input field.

#### Scenario: Matching tags shown
- **WHEN** user types characters in the tag input
- **THEN** system displays existing tags that contain the typed characters

#### Scenario: No matches found
- **WHEN** user types characters that match no existing tags
- **THEN** system shows option to create a new tag with the typed text

#### Scenario: Select from suggestions
- **WHEN** user clicks a suggested tag
- **THEN** system adds the tag to the current meme and clears the input

### Requirement: Tag pill display
The system SHALL display tags as pill-shaped badges that can be added or removed.

#### Scenario: Add tag creates pill
- **WHEN** user adds a tag to a meme
- **THEN** system displays the tag as a pill with a remove button

#### Scenario: Remove tag via pill
- **WHEN** user clicks the remove button on a tag pill
- **THEN** system removes the tag from the current meme

### Requirement: Tag creation via input
The system SHALL allow creating new tags by typing and pressing Enter or comma.

#### Scenario: Create tag with Enter
- **WHEN** user types a new tag name and presses Enter
- **THEN** system creates the tag, adds it to the meme, and clears the input

#### Scenario: Create tag with comma
- **WHEN** user types a tag name followed by a comma
- **THEN** system creates the tag, adds it to the meme, and clears the input

### Requirement: Prevent duplicate tags on meme
The system SHALL prevent adding the same tag twice to a single meme.

#### Scenario: Attempt duplicate tag
- **WHEN** user tries to add a tag already on the current meme
- **THEN** system ignores the addition and highlights the existing tag
