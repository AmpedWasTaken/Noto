# Noto

**Noto** is a minimal transparent note overlay for desktop. By default it stacks like a normal window so you can work in other apps; use **On top** in the bar when you want it pinned above everything. Built with Electron, React, TypeScript, and Tailwind CSS.

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

While Noto is running, press **Ctrl+Shift+N** (Windows/Linux) or **Cmd+Shift+N** (macOS) to create a new note. If the overlay was hidden, it is shown and focused first. **Ctrl+Alt+N** / **Cmd+Alt+N** does the same if the primary shortcut conflicts with another app.

### Hide overlay

Press **Ctrl+Shift+H** to hide or show the Noto window, or use the **Hide** control in the top-right bar. When hidden, use **Ctrl+Shift+H** again to bring Noto back. Reminders are still checked in the background; your notes are flushed to disk when you hide so notifications keep working.

### Notes UI

Drag a note by its header. Resize using the **bottom edge** (height), **right edge** (width), or the **bottom-right corner** (both). Close a note with **×** — you’ll be asked to confirm before it’s removed. Checklist items use custom toggles and inline text; add rows with **+ Add**.

Each card can be a simple **note** or a **support** entry: name, optional company, website, phone, and a short description (“wat er aan de hand is”). Use **Notitie** / **Support** on the card to switch, or **+ Support** in the top bar for a new support card. Support opens as a normal-sized card (no full-screen); drag and resize like other notes.

Use **Inklappen** on a card to show only the title in a compact strip; **Uitklappen** restores the full card. On **Notitie** cards, **Nu** sends a quick native nudge (“did you finish this?”), and **Over 1 uur** schedules a background reminder; you can clear the scheduled time with **Gepland wissen**.

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
