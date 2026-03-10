## Why

Need a personal meme collection website to store, organize, and quickly find memes. Currently memes are scattered across devices and hard to search. A dedicated gallery with tagging solves organization and retrieval.

## What Changes

- Create an Astro-based web application for meme management
- Support multiple upload methods: clipboard paste, drag-and-drop, file picker
- Handle PNG, JPG, JPEG, GIF, and MP4 file formats
- Implement tag-based organization with reusable tags
- Provide a sidebar showing recent uploads for quick access
- Enable tag-based filtering to find related memes quickly
- Store meme metadata including title, description, and tags

## Capabilities

### New Capabilities

- `media-upload`: Handle file uploads via clipboard paste, drag-and-drop zone, and file picker. Support PNG, JPG, JPEG, GIF, and MP4 formats with preview before confirmation.
- `meme-storage`: Persist meme files and metadata (title, description, tags, upload date). Provide CRUD operations for meme entries.
- `tag-management`: Store reusable tags across uploads. Suggest existing tags during entry. Allow adding new tags that become available for future use.
- `meme-gallery`: Display memes in main gallery view with full details. Show recent memes in sidebar. Filter gallery by clicking tag pills.

### Modified Capabilities

(none - this is a new project)

## Impact

- New Astro 5.0+ project with strict TypeScript
- Astro DB (libSQL) for meme metadata and tag persistence - zero external dependencies
- File storage in public/uploads/ for media files
- Pure .astro components with client islands only for interactive parts
- Native Web APIs for file handling (File API, Clipboard API, DataTransfer API)
- View Transitions with ClientRouter for smooth navigation
- CSS variables for theming - no CSS-in-JS libraries
