## Context

Memenator stores memes privately in MinIO with no external sharing capability. Users want to share memes with others via public links. Imgur offers a free anonymous upload API that requires only a Client ID (no OAuth flow needed).

Current flow: User uploads meme → stored in MinIO → displayed in gallery
New flow: User clicks share → backend fetches from MinIO → uploads to Imgur → returns public link

## Goals / Non-Goals

**Goals:**
- Enable one-click sharing of any meme to Imgur
- Display the Imgur link with copy-to-clipboard functionality
- Store Imgur Client ID in environment configuration
- Support both images (PNG, JPG, GIF) and videos (MP4)

**Non-Goals:**
- OAuth-based Imgur accounts (anonymous upload only)
- Storing/caching Imgur links in the database
- Bulk sharing multiple memes at once
- Alternative sharing services (only Imgur for now)

## Decisions

### 1. Anonymous Upload vs OAuth

**Decision**: Use anonymous upload with Client ID only

**Rationale**: OAuth adds complexity (redirect flow, token management, refresh) for minimal benefit. Anonymous uploads are simpler and sufficient for sharing memes. The 12,500 uploads/day limit is more than enough for personal use.

**Alternatives considered**:
- Full OAuth: More control but requires user to have Imgur account
- Other services (Cloudinary, imgbb): Less recognizable URLs, varying free tiers

### 2. Server-side Upload

**Decision**: Upload from backend, not frontend

**Rationale**: 
- Client ID stays server-side (not exposed in browser)
- Files are already in MinIO, no need to re-download to client
- Simplifies error handling and retry logic

**Flow**:
```
Client                  Server                 MinIO              Imgur
  |--- POST /api/share --->|                      |                  |
  |                        |--- GET file -------->|                  |
  |                        |<-- file data --------|                  |
  |                        |--- POST upload -------------------->|   |
  |                        |<-- imgur link -----------------------|  |
  |<-- { link: "..." } ----|                      |                  |
```

### 3. UI Component: Toast Notification

**Decision**: Show share result in a toast notification with copy button

**Rationale**: 
- Non-blocking (user can continue browsing)
- Consistent with modern UX patterns
- Simpler than modal (no dismiss handling needed)
- Toast auto-dismisses after delay or stays if user interacts

**Alternatives considered**:
- Modal dialog: More intrusive, requires explicit dismiss
- Inline expansion: Would need to restructure MemeCard layout

### 4. Share Button Placement

**Decision**: Add share button next to delete button in MemeCard header

**Rationale**: Groups all actions together, follows existing pattern, minimal layout changes.

## Risks / Trade-offs

**[Risk] Imgur API rate limits** → Use anonymous uploads which have generous limits (12,500/day). For personal use, this is unlikely to be hit.

**[Risk] Imgur service unavailable** → Show error toast with retry option. No local caching of links means each share is independent.

**[Risk] Large video files may timeout** → Imgur accepts up to 200MB for video. Most memes are small. Show progress indicator for larger uploads.

**[Trade-off] No link persistence** → Sharing the same meme twice creates two Imgur uploads. This is acceptable for simplicity; persisting links would require schema changes.

**[Trade-off] Client ID in env only** → If someone deploys without setting IMGUR_CLIENT_ID, sharing fails gracefully with clear error message.
