
# PRISM Dashboard UI Design

High-fidelity React implementation of the PRISM v1 dashboard concept. The bundle recreates the Figma source (https://www.figma.com/design/ZNRC96bAw6M2Xo7TvluNxo/PRISM-Dashboard-UI-Design) with production-ready component abstractions, tokenized theming, and demo data to showcase the end-to-end interaction model.

## Architecture Overview

- **Runtime**: React 18 + TypeScript, bootstrapped via Vite 6 for ESBuild-based dev server and Rollup production bundles (`src/main.tsx`, `src/App.tsx`).
- **Styling**: Tailwind CSS v4 build output for reset/utility layers (`src/index.css`) combined with a handcrafted design-token sheet (`src/styles/globals.css`) that exports PRISM surfaces, typography, and chart palettes.
- **Component primitives**: Radix UI headless primitives wrapped in local adapters under `src/components/ui`. These wrappers expose a consistent API, extend with PRISM tokens, and wire type-safe props.
- **Visualization**: Recharts renders KPI bar/line combos and spark-lines (`src/components/Overview.tsx`). Embla Carousel powers scrollable galleries (`src/components/DesignSystem.tsx`, `src/components/Board.tsx`).
- **State management**: Local React state only—no global stores. `App.tsx` orchestrates view toggles, glass effect switch, and command palette visibility.
- **Interaction model**: Keyboard-friendly navigation (⌘/Ctrl + K summons the search palette), inspector overlay, automation flows, and empty-state explorations handled by dedicated view modules under `src/components`.

## UI Modules

- **Design System (`src/components/DesignSystem.tsx`)**  
  Demonstrates token usage across surfaces, typography, motion, glass variants, and chart palettes.
- **Overview (`src/components/Overview.tsx`)**  
  High-level delivery metrics with KPI grid, dual-axis trends (`ResponsiveContainer`, `BarChart`, `LineChart`), and exception lists.
- **Board / Table (`src/components/Board.tsx`, `src/components/Table.tsx`)**  
  Kanban-style swim lanes and analytical table view with custom filters, density controls, and Radix-powered dropdowns.
- **Inspector (`src/components/Inspector.tsx`)**  
  Drawer-like panel inspected via toggled state in `App.tsx`, reusing `ui/drawer.tsx` primitives and glass fallback logic.
- **PlanTM / Automations / EmptyStates / SearchPalette**  
  Narrative walkthroughs of planning rituals, automation builders, empty-state choreography, and the command palette experience (includes fuzzy search via `cmdk`).

Each module is lazy-loaded at runtime through conditional rendering—no code splitting required for this showcase, but the structure keeps views isolated and reusable.

## Design Tokens and Theming

- `src/styles/globals.css` defines the complete PRISM token dictionary: multi-level surfaces, WCAG-compliant typography colors, accent hues, stroke opacities, focus rings, glass overlays, chart palettes, radii, and base typography scale.
- CSS custom properties are surfaced via Tailwind v4 `@layer` and `@theme inline` directives, allowing both utility classes (`bg-surface-1`, `text-text-high`) and vanilla inline styles to resolve to the same palette.
- Scrollbars, reduced-motion fallbacks, and global typography defaults are declared once in the global sheet to guarantee consistency across modules.

## Component Library Wrappers

The `src/components/ui` directory wraps Radix primitives (accordion, alert-dialog, command, navigation-menu, etc.), adds PRISM classNames, and centralizes variant logic. These adapters provide:

- Tailwind-compatible slot APIs (`class-variance-authority`, `tailwind-merge`).
- TypeScript inference for refs and discriminated unions.
- Visual defaults aligned with PRISM tokens (focus rings, radii, glass backgrounds).
- Utility hooks for responsive behavior (`use-mobile.ts`) and layout helpers (`sidebar.tsx`, `resizable.tsx`).

## Data and Demo Content

- Demo metrics and copy live alongside components (e.g., KPI arrays in `Overview.tsx`, board column definitions in `Board.tsx`).
- The dataset favors deterministic arrays for deterministic renders—no network fetches required.
- Command palette options mirror nav items and embed Quick Actions to illustrate app-level shortcuts.

## Project Structure

```
.
├── index.html                 # Vite entry shell
├── package.json               # Dependencies and scripts
├── src
│   ├── App.tsx                # Shell layout, nav, and view switching
│   ├── main.tsx               # Vite bootstrap
│   ├── index.css              # Tailwind v4 reset + utilities
│   ├── styles/globals.css     # PRISM design tokens and global styles
│   ├── components
│   │   ├── *.tsx              # Feature views (Overview, Board, Inspector, etc.)
│   │   ├── figma              # Fallback helpers (e.g., image loader)
│   │   └── ui                 # Radix component wrappers + utilities
│   └── guidelines             # Placeholder for additional system guidance
└── vite.config.ts             # Vite + SWC React configuration
```

## Getting Started

1. Install dependencies (Node 18+ recommended):
   ```bash
   npm install
   ```
2. Launch the dev server with hot-module replacement:
   ```bash
   npm run dev
   ```
3. Open the surfaced URL (default `http://localhost:5173`) to explore the dashboard. Use ⌘/Ctrl + K to open the command palette, and toggle "Glass Effects" in the left rail to inspect overlay variants.

## Build and Deployment

- Production bundles:
  ```bash
  npm run build
  ```
  Generates optimized assets under `dist/` using Vite’s Rollup pipeline.
- Static hosting ready—serve `dist/` via any CDN or static web host (Netlify, Vercel, S3).

## Accessibility and Quality Considerations

- Color tokens satisfy WCAG AA contrast on the dark surface stack; focus rings use a dedicated `--focus-ring` token for visibility.
- Radix primitives provide keyboard navigation, ARIA attributes, and focus trapping for dialogs, popovers, menus, and command palette.
- Reduced-motion media query short-circuits animations, and the glass effect toggle lets low-power users fall back to matte surfaces.

## Origin and Credits

- Visual source of truth: PRISM Dashboard UI Design Figma file.
- Iconography: `lucide-react`.
- Charts: `recharts`.
- Carousel: `embla-carousel-react`.
- Command palette: `cmdk`.

This repository captures the visual + interaction spec as code, providing a baseline for engineering teams to integrate real data and application logic.
  
