## 1. Configuration

- [x] 1.1 Add IMGUR_CLIENT_ID to .env.example with description
- [x] 1.2 Add IMGUR_CLIENT_ID to .env (user must provide their own value)

## 2. Backend - Imgur Client

- [x] 2.1 Create src/lib/imgur.ts with uploadToImgur function
- [x] 2.2 Implement image upload using Imgur anonymous API (POST https://api.imgur.com/3/image)
- [x] 2.3 Implement video upload using Imgur anonymous API (POST https://api.imgur.com/3/upload)
- [x] 2.4 Handle Imgur API error responses and return structured errors

## 3. Backend - Share API Endpoint

- [x] 3.1 Create src/pages/api/share.ts POST endpoint
- [x] 3.2 Validate request body contains memeId
- [x] 3.3 Fetch meme record from database to get file key
- [x] 3.4 Fetch file from MinIO using existing getFileBuffer helper
- [x] 3.5 Call Imgur upload and return { success, link } or { success, error }

## 4. Frontend - Toast Component

- [x] 4.1 Create src/components/Toast.astro for share notifications
- [x] 4.2 Implement toast show/hide with auto-dismiss timer
- [x] 4.3 Add copy-to-clipboard button with success feedback
- [x] 4.4 Style toast for success and error states

## 5. Frontend - Share Button

- [x] 5.1 Add share button SVG icon to MemeCard.astro header (next to delete)
- [x] 5.2 Style share button consistent with delete button
- [x] 5.3 Add click handler to call POST /api/share with memeId
- [x] 5.4 Show loading state on button during upload
- [x] 5.5 Display success toast with Imgur link on success
- [x] 5.6 Display error toast on failure

## 6. Testing

- [x] 6.1 Test share button appears on all meme cards
- [x] 6.2 Test successful image share returns valid Imgur link
- [x] 6.3 Test successful video share returns valid Imgur link
- [x] 6.4 Test copy-to-clipboard functionality
- [x] 6.5 Test error handling when IMGUR_CLIENT_ID is missing
- [x] 6.6 Test error handling for Imgur API failures
