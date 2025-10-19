
<div align="center">

# PRISM Dashboard UI

High‑fidelity React 18 dashboard implementing the PRISM design system with Tailwind v4, Radix UI primitives, and a production‑oriented theming model. Includes feature modules, visualization stack, and accessibility‑first defaults.

![Tech](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![Radix UI](https://img.shields.io/badge/Radix%20UI-1.1-black)

</div>

## Table of Contents

- Overview
- Feature Highlights
- Tech Stack
- Architecture
- Theming Strategy
- Component Catalog
- Visualization Stack
- Setup
- Build & Deploy
- Project Structure
- Accessibility
- Keyboard Shortcuts
- Credits

## Overview

This repository recreates the PRISM Dashboard UI (Figma source: https://www.figma.com/design/ZNRC96bAw6M2Xo7TvluNxo/PRISM-Dashboard-UI-Design) as a coded reference implementation. It emphasizes design tokens, accessible primitives, and modular views to make the UI easy to extend with real data.

## Feature Highlights

- Design System view demonstrating tokens, surfaces, typography, glass overlays, and chart palettes.
- Overview analytics with KPI grid, bar/line trends, and exception feed.
- Board and Table views for planning and analysis workflows.
- Inspector panel and Search/Command Palette (⌘/Ctrl + K).
- Automations builder and rich Empty States for UX clarity.

## Tech Stack

- React 18 + TypeScript
- Vite 6 (SWC React plugin) for dev/build
- Tailwind CSS v4 reset/utilities (`src/index.css`)
- Radix UI headless primitives wrapped locally
- Recharts for charts, Embla Carousel for galleries
- Lucide icons, cmdk for command palette

## Architecture

- App Shell (`src/App.tsx`): Layout, navigation, view switching, toggles (glass effects, palette visibility).
- View Modules (`src/components/*.tsx`): Self‑contained feature views (Design System, Overview, Board, Table, Inspector, PlanTM, Automations, Empty States, Search Palette).
- UI Primitives (`src/components/ui/*`): Typed wrappers around Radix UI components with PRISM token defaults and utility helpers.
- Styling (`src/index.css`, `src/styles/globals.css`): Tailwind v4 layers + a design‑token sheet supplying surfaces, text, brand, strokes, focus, glass, chart palettes, and typography scale.
- State: Local React state; no global store required for showcase.

```
[App Shell]
   ├─ toggles / routing-by-view
   └─ renders one [View Module]
        ├─ consumes [UI Primitives]
        └─ styled via [PRISM Tokens]
```

## Theming Strategy

Custom properties in `src/styles/globals.css` define the PRISM palette and semantics. Tailwind v4 `@layer` + `@theme inline` expose tokens as utilities and variables.

Core token groups:
- Surfaces: `--surface-0 … --surface-3` + overlays
- Text: `--text-high`, `--text-med`, `--text-subtle`
- Brand/Accents: `--brand-cyan`, `--brand-violet`, info/success/warning/danger
- Strokes/Focus: `--stroke-low/med/high`, `--focus-ring`
- Glass: `--glass-bg`, `--glass-stroke`
- Charts: Okabe–Ito palette (`--chart-okabe-1 … 8`)
- Typography: scale (`--text-display … --text-micro`) and weights

Example (excerpt):

```css
:root {
  --surface-0: #0B0D12;
  --surface-1: #121826;
  --text-high: rgba(255,255,255,0.92);
  --brand-cyan: #6EE7F3;
  --focus-ring: #A7E9EF;
}
```

## Component Catalog

Radix‑based primitives live under `src/components/ui/` and are themed with PRISM classes/variables.

- Overlay: `dialog`, `drawer`, `sheet`, `tooltip`, `popover`, `hover-card`, `alert-dialog`
- Navigation: `navigation-menu`, `menubar`, `sidebar`, `breadcrumb`, `tabs`
- Inputs & Forms: `input`, `textarea`, `checkbox`, `radio-group`, `select`, `slider`, `switch`, `input-otp`, `label`, `form`
- Data Display: `table`, `card`, `badge`, `progress`, `skeleton`, `separator`, `pagination`
- Layout & Behavior: `accordion`, `collapsible`, `resizable`, `scroll-area`, `aspect-ratio`, `avatar`
- Command: `command` (cmdk-powered palette)

## Visualization Stack

- Recharts drives analytics in `Overview.tsx` (`ResponsiveContainer`, `BarChart`, `LineChart`, `Bar`, `Line`) with token‑mapped colors and accessible axes.
- Embla Carousel powers gallery‑style content where applicable.

## Setup

Requirements: Node 18+ and npm.

```bash
npm install
npm run dev
```

Open the dev URL (typically `http://localhost:5173`). Use ⌘/Ctrl + K for the command palette. Toggle “Glass Effects” in the left rail to compare glass vs. matte overlays.

## Build & Deploy

```bash
npm run build
```

Outputs optimized assets to `dist/` (Rollup via Vite). Deploy `dist/` to any static host/CDN (e.g., Netlify, Vercel, S3, Cloudflare Pages).

## Project Structure

```
.
├── index.html
├── package.json
├── src
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── styles/
│   │   └── globals.css
│   ├── components/
│   │   ├── *.tsx                # Feature views
│   │   ├── figma/               # Fallback helpers
│   │   └── ui/                  # Radix wrappers + utils
│   └── guidelines/
└── vite.config.ts
```

## Accessibility

- WCAG AA contrast across dark surfaces; clear focus rings via `--focus-ring`.
- Radix primitives ensure keyboard operability, ARIA roles, focus management, and escape‑to‑close behaviors.
- Reduced‑motion query disables non‑essential animation; matte fallbacks for glass overlays.
- Semantic headings and labels in key views; table/graph text sized for legibility (`--text-meta`/`--text-micro` carefully scoped).

## Keyboard Shortcuts

- ⌘/Ctrl + K — Open command palette

## Credits

- Design reference: PRISM Dashboard UI (Figma)
- Icons: `lucide-react`
- Charts: `recharts`
- Carousel: `embla-carousel-react`
- Command Palette: `cmdk`

—

This codebase captures the visual + interaction spec as maintainable React components, ready to plug into real data and application logic.
  
