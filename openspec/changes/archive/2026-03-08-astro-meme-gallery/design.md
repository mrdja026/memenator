## Context

Building a personal meme gallery as a single-user web application. No existing codebase - starting fresh with Astro 5.0+. The app needs to handle media uploads, persist data, and provide fast browsing with tag-based filtering.

Constraints:
- Single user (no auth required)
- Local deployment initially
- KISS and DRY principles - no bloated libraries
- Pure TypeScript/JavaScript with native Web APIs
- Zero client-side JS by default (Astro Way)

## Goals / Non-Goals

**Goals:**
- Fast, zero-JS-by-default gallery with selective hydration for interactive islands
- Support clipboard paste, drag-drop, and file picker uploads using native Web APIs
- Persistent storage via Astro DB (built-in libSQL)
- Reusable tag system with autocomplete
- Filter gallery by tags via URL query params
- View Transitions for smooth navigation

**Non-Goals:**
- Multi-user support or authentication
- Cloud deployment (can be added later)
- Video transcoding or image optimization
- Social features (sharing, comments)
- External npm libraries for things native APIs can handle

## Decisions

### Framework: Astro 5.0+ with Islands Architecture
**Choice**: Astro with `.astro` components, client islands only where interactive
**Rationale**: Ships zero JS by default. Gallery display is static HTML. Only upload zone, tag input, and media preview need hydration via `client:visible` or `client:load`.
**Alternatives considered**: 
- Next.js: Ships too much JS for a content-display app
- React SPA: Violates zero-JS-by-default goal

### Storage: Astro DB (libSQL)
**Choice**: Use Astro DB with typed schema for Meme, Tag, and MemeTag tables. Media files stored in `public/uploads/`.
**Rationale**: Built into Astro, zero external dependencies, proper SQL queries, handles concurrent writes, typed with Zod-like schemas. Follows "no npm bloat" principle.
**Alternatives considered**:
- JSON files: Concurrency issues, manual querying, no indexing
- SQLite + better-sqlite3: External dependency, Astro DB does this natively

### Database Schema
```typescript
// db/config.ts
import { defineDb, defineTable, column } from 'astro:db';

const Meme = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    title: column.text(),
    description: column.text({ optional: true }),
    filePath: column.text(),
    fileType: column.text(), // 'image' | 'video'
    createdAt: column.date({ default: NOW }),
  }
});

const Tag = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text({ unique: true }),
  }
});

const MemeTag = defineTable({
  columns: {
    memeId: column.text({ references: () => Meme.columns.id }),
    tagId: column.text({ references: () => Tag.columns.id }),
  }
});
```

### Upload Handling: Native Web APIs + API Endpoint
**Choice**: Use native File API, DataTransfer API for drag-drop, Clipboard API for paste. POST to `/api/upload` endpoint.
**Rationale**: No libraries needed. FileReader for preview, FormData for upload. Native APIs are well-supported.
**Alternatives considered**:
- Dropzone.js: Unnecessary dependency, native APIs sufficient

### View Transitions & Navigation
**Choice**: Use `<ClientRouter />` in layout, handle script re-init with `astro:page-load` event
**Rationale**: Built-in Astro feature for smooth SPA-like navigation. Persist upload form state with `data-astro-transition-persist`.

### Tag Filtering: URL Query Params
**Choice**: Filter state stored in URL (`?tag=funny`), read server-side in Astro pages
**Rationale**: Shareable URLs, works without client JS, browser back/forward works naturally.

### Styling: CSS Variables + Utility Classes
**Choice**: Custom CSS with variables in Layout, no Tailwind initially
**Rationale**: KISS - keeps bundle minimal, single source of truth for theme. Can add Tailwind later if needed.

### Project Structure (per Agents.md)
```
src/
├── components/     # Atomic components (.astro preferred)
│   ├── DropZone.astro
│   ├── MediaPreview.astro
│   ├── TagInput.astro
│   ├── TagPill.astro
│   ├── MemeCard.astro
│   ├── Gallery.astro
│   ├── Sidebar.astro
│   └── UploadForm.astro
├── layouts/        # Base page wrappers
│   └── Layout.astro
├── pages/          # File-based routing
│   ├── index.astro
│   └── api/
│       ├── upload.ts
│       ├── tags.ts
│       └── memes/[id].ts
├── lib/            # Pure TS utilities (replaces src/utils/)
│   ├── db.ts       # Database query helpers
│   └── files.ts    # File handling utilities
db/
├── config.ts       # Astro DB schema
└── seed.ts         # Optional seed data
public/
└── uploads/        # Stored media files
```

## Risks / Trade-offs

**[Risk] Astro DB is newer feature** → Mitigation: Well-documented, uses battle-tested libSQL. Fallback to SQLite if issues arise.

**[Risk] Large media files slow page load** → Mitigation: Native `loading="lazy"` on images, Intersection Observer for videos. No library needed.

**[Risk] No full-text search** → Trade-off accepted. Tags + title should suffice. Can add later with SQL LIKE queries.

**[Trade-off] No image optimization** → KISS principle. Users pre-optimize or we add Sharp in future iteration.

**[Trade-off] .astro components over React** → Fewer features but zero JS overhead. Use `client:*` islands only where truly needed.
