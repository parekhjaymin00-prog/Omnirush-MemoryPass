# MemoryPass — a local memory graph for everyday AI context

MemoryPass turns personal notes into a visible, editable, privacy-aware memory graph that stays in the browser.

## The problem

Important context is scattered across notes and conversations, while sharing it with an AI can expose more than intended. MemoryPass makes that context inspectable, searchable, editable, conflict-aware, and portable without sending memory data to a server.

## Features

- Interactive memory graph with short readable node labels, zooming, dragging, hover details, and connected-memory inspection.
- Guided demo that loads sample memories, runs an Atlas recall query, and tours the main graph, recall, contradiction, and passport features.
- Recall search with ranked scores, match explanations, glowing matching nodes, and dimmed non-matches.
- Contradiction detection for conflicting location and workplace facts, with Keep newer/older resolution that archives the other memory.
- Timeline cutoff slider for filtering graph memories and connections by date.
- Memory library controls for editing, deleting, pinning, archiving, and restoring memories.
- Privacy detection and warnings for emails, phones, API keys, payment cards, Aadhaar, PAN, and UPI identifiers.
- Shareable Passport with per-memory checkboxes, a character budget, redacted preview, redaction count, and clipboard copy.
- JSON export/import with schema validation and checksum verification.
- Local-only persistence with safe fallback behavior when browser storage is unavailable.
- Responsive mobile and laptop layouts, keyboard-focus styling, labeled controls, friendly empty states, and startup error recovery.

## How to use

1. Open the Graph tab and choose **Guided demo** for a complete tour, or add a memory manually.
2. Use the Recall box to ask about a topic such as `Atlas` or `where did I work`.
3. Review conflicts in the Contradictions panel and keep the newer or older memory.
4. Use the Memories tab to edit, pin, archive, or delete entries.
5. Use Passport to choose shareable memories and copy the redacted preview.
6. Use Export JSON for a backup and Import JSON to restore a verified export.

## Tech stack

- TypeScript
- Vite
- D3 force simulation (`d3-force`)
- Vitest
- jsdom for offline startup smoke tests
- Browser Local Storage with an in-memory fallback

There are no runtime network calls, CDN assets, or server-side application features.

## Project structure

```text
src/
  core/       Pure memory, graph, recall, privacy, passport, timeline, and portability logic
  data/       Built-in guided-demo sample memories
  main.ts     Client-side app composition and event wiring
  storage.ts  Local persistence and legacy-data migration
  styles.css  Responsive dark UI styles
test/         Offline Vitest unit and startup smoke tests
index.html    Vite entry document
Dockerfile    Reproducible Node 20 build/test container
```

## Local quickstart

Requirements: Node.js 20, pinned by `.nvmrc`.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Test command

Run the complete offline test suite:

```bash
npm test
```

Create the production static bundle:

```bash
npm run build
```

## Docker offline command

Docker is not required for local development. To build and run the reproducible offline test image yourself:

```bash
docker build -t memorypass-offline .
docker run --rm memorypass-offline
```

## Live demo

Live demo: _not published yet — placeholder_

## Roadmap (not implemented)

- Cloud synchronization or multi-device accounts.
- Server-backed collaboration and shared workspaces.
- AI-generated summaries or embeddings.
- Browser extensions for automatic capture.
- Conflict-resolution history beyond the current archive action.
