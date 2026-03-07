## 1. Project Setup

- [x] 1.1 Initialize Astro 5.0+ project with strict TypeScript
- [x] 1.2 Enable Astro DB integration in astro.config.mjs
- [x] 1.3 Configure project structure (src/components, src/layouts, src/pages, src/lib, public/uploads)
- [x] 1.4 Create uploads directory in public/ with .gitkeep
- [x] 1.5 Add base CSS setup with CSS variables in Layout.astro (colors, spacing, typography)
- [x] 1.6 Add ClientRouter to Layout.astro for View Transitions
- [x] 1.7 Set up astro:page-load event listener pattern for script re-initialization

## 2. Database Schema (Astro DB)

- [x] 2.1 Create db/config.ts with Meme table schema (id, title, description, filePath, fileType, createdAt)
- [x] 2.2 Add Tag table schema (id, name unique)
- [x] 2.3 Add MemeTag junction table schema (memeId, tagId with references)
- [x] 2.4 Create db/seed.ts with optional sample data
- [x] 2.5 Run astro db push to initialize database

## 3. Data Layer (src/lib/)

- [x] 3.1 Create src/lib/db.ts with typed query helpers
- [x] 3.2 Implement getAllMemes() - returns memes sorted by createdAt desc
- [x] 3.3 Implement getRecentMemes(limit) - returns N most recent memes
- [x] 3.4 Implement getMemesByTag(tagName) - returns memes with specific tag
- [x] 3.5 Implement getMemeWithTags(id) - returns single meme with its tags
- [x] 3.6 Implement createMeme(data) - inserts meme and associates tags
- [x] 3.7 Implement deleteMeme(id) - removes meme and tag associations
- [x] 3.8 Implement getAllTags() - returns all tags for autocomplete
- [x] 3.9 Implement getOrCreateTag(name) - finds existing or creates new tag
- [x] 3.10 Create src/lib/files.ts with unique filename generator using crypto.randomUUID()

## 4. API Endpoints (src/pages/api/)

- [x] 4.1 Create POST /api/upload.ts endpoint
- [x] 4.2 Parse multipart form data (file, title, description, tags JSON)
- [x] 4.3 Validate file type (PNG, JPG, JPEG, GIF, MP4)
- [x] 4.4 Validate file size with configurable limit
- [x] 4.5 Save file to public/uploads/ with unique filename
- [x] 4.6 Create meme record in database with tag associations
- [x] 4.7 Return JSON response with new meme data
- [x] 4.8 Create GET /api/tags.ts endpoint returning all tags for autocomplete
- [x] 4.9 Create DELETE /api/memes/[id].ts endpoint
- [x] 4.10 Delete file from public/uploads/ and remove database records

## 5. Layout & Base Components

- [x] 5.1 Create Layout.astro with two-column layout (sidebar + main)
- [x] 5.2 Add ClientRouter and base meta tags
- [x] 5.3 Add CSS variables for theming (--color-bg, --color-text, --color-accent, etc.)
- [x] 5.4 Create responsive breakpoints (sidebar collapses on mobile)

## 6. Upload UI Components (Islands)

- [x] 6.1 Create DropZone.astro with client:visible directive
- [x] 6.2 Implement native dragover/dragleave/drop event handlers
- [x] 6.3 Add visual feedback on drag (CSS class toggle)
- [x] 6.4 Create clipboard paste listener using Clipboard API (document.addEventListener paste)
- [x] 6.5 Create hidden file input with button trigger for file picker
- [x] 6.6 Create MediaPreview.astro component
- [x] 6.7 Use FileReader.readAsDataURL for image/video preview
- [x] 6.8 Render <img> for images, <video controls> for MP4/GIF

## 7. Tag Input Component (Island)

- [x] 7.1 Create TagPill.astro component with remove button (× icon as SVG)
- [x] 7.2 Create TagInput.astro with client:load directive
- [x] 7.3 Fetch existing tags from /api/tags on mount
- [x] 7.4 Implement autocomplete dropdown filtering on input
- [x] 7.5 Handle Enter and comma keys to add tag
- [x] 7.6 Prevent duplicate tags on same meme (visual feedback)
- [x] 7.7 Dispatch custom event when tags change for parent form

## 8. Upload Form Component

- [x] 8.1 Create UploadForm.astro combining DropZone, MediaPreview, inputs, TagInput
- [x] 8.2 Add title input (required) and description textarea (optional)
- [x] 8.3 Add confirm button that POSTs to /api/upload
- [x] 8.4 Use native fetch() with FormData for multipart upload
- [x] 8.5 Show loading state during upload (disable button, spinner)
- [x] 8.6 Clear form and emit success event on completion
- [x] 8.7 Display validation errors from API response
- [x] 8.8 Use data-astro-transition-persist to maintain form state across navigation

## 9. Gallery Components

- [x] 9.1 Create MemeCard.astro with media, title, description, tag pills
- [x] 9.2 Use native loading="lazy" on <img> elements
- [x] 9.3 Use Intersection Observer for lazy video loading (no autoplay until visible)
- [x] 9.4 Display TagPill components for each tag (clickable for filtering)
- [x] 9.5 Add delete button with confirmation (native confirm())
- [x] 9.6 Create Gallery.astro that maps memes to MemeCard components
- [x] 9.7 Style as responsive grid (CSS Grid, auto-fill columns)

## 10. Sidebar Component

- [x] 10.1 Create Sidebar.astro with fixed positioning
- [x] 10.2 Include UploadForm at top of sidebar
- [x] 10.3 Create RecentMemes.astro showing thumbnail grid
- [x] 10.4 Thumbnails link to main gallery (anchor with hash or scroll)
- [x] 10.5 Style sidebar width and overflow scrolling

## 11. Main Page & Tag Filtering

- [x] 11.1 Create src/pages/index.astro as main gallery page
- [x] 11.2 Read ?tag query param using Astro.url.searchParams
- [x] 11.3 Fetch filtered or all memes based on query param
- [x] 11.4 Pass memes to Gallery component
- [x] 11.5 Show active filter indicator with clear link (removes query param)
- [x] 11.6 TagPill clicks navigate to /?tag=<name> for filtering

## 12. Empty States & Polish

- [x] 12.1 Add empty state in Gallery when no memes exist
- [x] 12.2 Add empty state when tag filter has no results
- [x] 12.3 Add error boundary/fallback for failed image loads
- [x] 12.4 Responsive styling: sidebar becomes top bar on mobile
- [x] 12.5 Add keyboard navigation for tag input (arrow keys, escape)
- [x] 12.6 Final visual polish (shadows, borders, spacing)
- [x] 12.7 Test View Transitions and form persistence
