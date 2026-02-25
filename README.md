# aMazeMe - Maze generator for kids

Interactive web application for generating configurable mazes with logic elements (keys, doors, treasures). Designed for children -- mazes can be printed as worksheets or solved on screen.

The app supports **English and Polish** -- switch languages instantly via the header toggle.

![aMazeMe app screenshot](App%20screenshot.png)

## Features

### Maze generation
- Recursive Backtracker algorithm (iterative DFS) with seeded pseudo-randomness -- identical seed produces identical maze
- Sizes from 3x3 to 50x50 cells
- Automatic entrance (top-left corner) and exit (bottom-right corner)

### Difficulty level
- Scale 0--10
- 0 = perfect maze (exactly one path between any two cells)
- Higher values remove random internal walls, creating alternative routes

### Interactive elements
- **Keys and doors** -- up to 5 key-door pairs, each in a different color. Key is always placed before its door on the solution path
- **Treasures** -- up to 10 treasures, dead-ends are preferred (harder to find)
- Automatic solvability verification -- Progressive BFS algorithm checks that the maze with elements can be completed

### Graphic themes (5 themes)
| Theme | Description |
|-------|-------------|
| Basic | Clean black lines on white background |
| Garden | Green background, flowers, hedges |
| Mine | Dark brown walls, rocks, minerals |
| Desert | Sandy colors, cacti |
| Ocean | Water colors, wave patterns |

### Printing
- Generate multiple mazes per printout (up to 12)
- Adaptive grid layout depending on maze size
- Optimized theme variants for printing

## Requirements

- Node.js (recommended version 18+)
- npm

## Getting started

```bash
# Install dependencies
npm install

# Development mode (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Linting

```bash
npm run lint
```

## Deployment

The app is fully client-side (no backend). The output of `npm run build` is static files in the `dist/` directory, which can be served from any HTTP server (GitHub Pages, Netlify, Vercel, etc.).

## Tech stack

- React 19 + TypeScript
- Vite
- HTML5 Canvas (maze rendering)
- No external runtime dependencies -- maze generation, solving, and rendering algorithms implemented from scratch
