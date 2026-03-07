## ADDED Requirements

### Requirement: Clipboard paste upload
The system SHALL accept image and video files pasted from the clipboard. Supported formats: PNG, JPG, JPEG, GIF, MP4.

#### Scenario: Paste image from clipboard
- **WHEN** user pastes clipboard content containing an image
- **THEN** system extracts the image and displays it in the upload preview area

#### Scenario: Paste unsupported format
- **WHEN** user pastes clipboard content that is not a supported format
- **THEN** system displays an error message indicating supported formats

### Requirement: Drag-and-drop upload
The system SHALL provide a dropzone area that accepts dragged files. Supported formats: PNG, JPG, JPEG, GIF, MP4.

#### Scenario: Drop single file
- **WHEN** user drags a supported file onto the dropzone
- **THEN** system displays the file in the upload preview area

#### Scenario: Drop multiple files
- **WHEN** user drags multiple files onto the dropzone
- **THEN** system displays the first file in preview and queues remaining files

#### Scenario: Visual feedback on drag
- **WHEN** user drags a file over the dropzone
- **THEN** system highlights the dropzone to indicate it accepts drops

### Requirement: File picker upload
The system SHALL provide a button to open the system file picker dialog.

#### Scenario: Select file via picker
- **WHEN** user clicks upload button and selects a file
- **THEN** system displays the selected file in the upload preview area

#### Scenario: Cancel file picker
- **WHEN** user opens file picker and cancels
- **THEN** system returns to previous state with no changes

### Requirement: Upload preview
The system SHALL display a preview of the selected media before confirmation.

#### Scenario: Image preview
- **WHEN** an image file is selected for upload
- **THEN** system displays the image at a viewable size in the preview area

#### Scenario: Video preview
- **WHEN** a video file is selected for upload
- **THEN** system displays a video player with playback controls in the preview area

### Requirement: File size validation
The system SHALL validate uploaded files do not exceed the maximum size limit.

#### Scenario: File within size limit
- **WHEN** user uploads a file under the size limit
- **THEN** system accepts the file and shows preview

#### Scenario: File exceeds size limit
- **WHEN** user uploads a file exceeding the size limit
- **THEN** system rejects the file and displays size limit error
