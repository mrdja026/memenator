## Why

Users want to share their memes with others outside the app. Currently, there's no way to get a public link for a meme - content is stored privately in MinIO. Adding Imgur integration enables quick sharing via a universally accessible link.

## What Changes

- Add a share button (icon) to each meme card in the gallery
- Create a backend API endpoint that uploads memes to Imgur
- Display the resulting Imgur link with copy-to-clipboard functionality
- Store Imgur API credentials in environment configuration for reuse

## Capabilities

### New Capabilities

- `imgur-sharing`: Share memes to Imgur with a single click, returning a public shareable link. Covers the share button UI, Imgur API integration, link display modal, and credential configuration.

### Modified Capabilities

(none)

## Impact

- **Frontend**: `MemeCard.astro` gets a new share button; new modal/toast component for displaying share links
- **Backend**: New `/api/share` endpoint; new `src/lib/imgur.ts` client module
- **Configuration**: New `IMGUR_CLIENT_ID` environment variable required
- **Dependencies**: No new npm packages needed (uses native fetch for Imgur API)
- **External**: Relies on Imgur's free anonymous upload API (rate limited to 12,500 uploads/day)
