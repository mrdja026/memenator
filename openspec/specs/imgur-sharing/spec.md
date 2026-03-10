## ADDED Requirements

### Requirement: Share button on meme cards
Each meme card SHALL display a share button icon next to the delete button. The share button SHALL be visually consistent with the existing delete button styling.

#### Scenario: Share button visibility
- **WHEN** a meme card is displayed in the gallery
- **THEN** the share button is visible in the card header alongside the delete button

#### Scenario: Share button hover state
- **WHEN** user hovers over the share button
- **THEN** the button displays a distinct hover style indicating it is interactive

### Requirement: Share to Imgur on click
When the share button is clicked, the system SHALL upload the meme to Imgur and return a public link.

#### Scenario: Successful image share
- **WHEN** user clicks the share button on an image meme (PNG, JPG, GIF)
- **THEN** the system uploads the image to Imgur via the anonymous upload API
- **THEN** the system displays the Imgur link in a toast notification

#### Scenario: Successful video share
- **WHEN** user clicks the share button on a video meme (MP4)
- **THEN** the system uploads the video to Imgur via the anonymous upload API
- **THEN** the system displays the Imgur link in a toast notification

#### Scenario: Share in progress
- **WHEN** the upload to Imgur is in progress
- **THEN** the share button displays a loading indicator
- **THEN** the share button is disabled to prevent duplicate uploads

### Requirement: Copy link to clipboard
The toast notification displaying the Imgur link SHALL include a copy button that copies the link to clipboard.

#### Scenario: Copy link success
- **WHEN** user clicks the copy button in the share toast
- **THEN** the Imgur link is copied to the system clipboard
- **THEN** the button text changes to indicate success (e.g., "Copied!")

### Requirement: Share error handling
The system SHALL display clear error messages when sharing fails.

#### Scenario: Missing Imgur configuration
- **WHEN** IMGUR_CLIENT_ID environment variable is not set
- **THEN** the share action displays an error toast with message indicating configuration is missing

#### Scenario: Imgur API error
- **WHEN** the Imgur API returns an error (rate limit, invalid file, service unavailable)
- **THEN** the share action displays an error toast with the error details

#### Scenario: Network failure
- **WHEN** the network request to Imgur fails
- **THEN** the share action displays an error toast indicating connection failure

### Requirement: Imgur API endpoint
The system SHALL expose a POST /api/share endpoint that handles Imgur uploads.

#### Scenario: Share API request
- **WHEN** POST /api/share is called with { memeId: string }
- **THEN** the server fetches the meme file from MinIO
- **THEN** the server uploads the file to Imgur using the configured Client ID
- **THEN** the server returns { success: true, link: string }

#### Scenario: Share API error response
- **WHEN** the share operation fails
- **THEN** the server returns { success: false, error: string } with appropriate HTTP status code

### Requirement: Imgur Client ID configuration
The Imgur Client ID SHALL be configured via the IMGUR_CLIENT_ID environment variable.

#### Scenario: Environment variable present
- **WHEN** IMGUR_CLIENT_ID is set in the environment
- **THEN** the share functionality uses this Client ID for Imgur API calls

#### Scenario: Environment variable missing
- **WHEN** IMGUR_CLIENT_ID is not set
- **THEN** the share API returns an error indicating configuration is required
