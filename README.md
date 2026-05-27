# Sudoku PWA

A classic Sudoku game built with React, TypeScript, and Tailwind CSS. Installable as a Progressive Web App and playable offline.

## Features

- Generated puzzles with easy, medium, and hard difficulty
- Notes (pencil marks) mode
- Conflict highlighting
- Keyboard support (1–9, arrows, N for notes, Delete to clear)
- Progress saved to local storage
- Offline play via service worker

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

Open the preview URL and use your browser’s “Install app” option to test the PWA. After the first load, the game works without a network connection.
