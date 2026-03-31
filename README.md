# Noto

**Noto** is a minimal always-on-top note overlay for desktop. Built with Electron, React, TypeScript, and Tailwind CSS.

## Prerequisites

- [Node.js](https://nodejs.org/) LTS (20+ recommended)

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Runs the Electron app with Vite hot reload for the renderer.

### Quick add

While Noto is running, press **Ctrl+Shift+N** (Windows/Linux) to create a new note instantly.

### Hide overlay

Press **Ctrl+Shift+H** to hide or show the Noto window, or use the **Hide** control in the top-right bar. When hidden, use **Ctrl+Shift+H** again to bring Noto back.

### Notes UI

Drag a note by its header. Resize using the **bottom edge** (height), **right edge** (width), or the **bottom-right corner** (both). Remove a note with **×** in the header.

### Data

Notes are stored locally as JSON under the app user data directory (`noto-data.json`).

## Build

```bash
npm run build
```

Outputs compiled main, preload, and renderer to `out/`.

## Project layout

- `electron/` — main process, preload, window helpers, notifications, global shortcuts
- `src/` — React renderer (`components/`, `features/`, `store/`, etc.)

## License

MIT
