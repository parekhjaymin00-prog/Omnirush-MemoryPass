# MemoryPass

Your AI memory, visible, editable, and portable to any AI.

MemoryPass is a client-side Vite/TypeScript app. Memory data stays in the
browser's local storage; there are no runtime network calls or CDN assets.

## Setup

Requirements: Node.js 20 (the pinned version is in `.nvmrc`).

```bash
npm ci
```

## Run locally

```bash
npm run dev
```

Open the local URL printed by Vite.

## Test and build

```bash
npm test
npm run build
```

The single offline test command is `npm test`.

## Deploy

Build the static site with `npm run build`, then serve the generated `dist/`
directory from any static web host. A Dockerfile is included for a clean
Node 20 build environment; Docker is not required for local development.

## Features

- Interactive graph with readable node titles, recall highlighting, conflicts,
  timeline filtering, and local-only persistence.
- Memories can be edited, pinned, archived, deleted, and marked shareable.
- Passport previews redact detected sensitive data and respect a size budget.
- JSON export/import validates schema and checksums before replacing local data.
