# Changelog

All notable changes to this project are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

---

## [Unreleased] — Editorial redesign

### About this effort

This branch overhauls the visual language of *The 2026 Iran War: A Geoeconomic
Autopsy* from its original dark "data terminal" aesthetic (Space Grotesk +
Space Mono + viridis neon on near-black) to a light, **New York Times–style
editorial "document of record."** The goal, chosen as the anchoring idea, is
that a reader should come away feeling they have read *the definitive record* —
an authoritative, citable account — not browsed a dashboard.

The redesign was developed with **gstack** (Claude Code) acting as a design
partner: it ran a structured design consultation (product analysis → aesthetic
direction → live HTML preview → codified design system). The contributor was
introduced to this workflow by faculty mentor **Sudeep Chakravarti**.

Commits on this branch are intentionally granular so the repository owner can
follow the reasoning at each step.

### Approach

1. **Read the existing site** to understand the content and current system
   (dark theme, viridis palette, monospace typography, card-based charts).
2. **Chose a direction and an anchor** — light editorial ("true NYT"), anchored
   on *the definitive record*: authority, restraint, permanence, citability.
3. **Proposed a complete, coherent system** — the editorial typographic triad,
   a restrained palette with a single crisis accent, a narrow reading measure
   with figures that break the column, calm motion, and a citation apparatus.
4. **Built a live HTML preview** dogfooding the exact fonts, palette, and
   layout on real content from the piece, including a light/dark ("night mode")
   toggle, before touching production code.
5. **Codified the system in `DESIGN.md`** as the single source of truth and
   wired `CLAUDE.md` to enforce it for all future visual work.

### Added
- `DESIGN.md` — editorial design system (typography, color, spacing, layout,
  motion) anchored on "the definitive record."
- `CLAUDE.md` — project guide instructing contributors/agents to read and
  enforce `DESIGN.md` before any visual change.
- `CHANGELOG.md` — this document.

### Design decisions
- **Typography:** retire Space Grotesk / Space Mono for the editorial triad —
  **Fraunces** (display/masthead), **Newsreader** (body), **Libre Franklin**
  (kickers, labels, captions, tabular-nums data).
- **Color:** replace viridis neon with paper + ink and a single restrained
  **oxblood `#A61B1B`** crisis accent, plus an NYT link blue `#326891`; a warm
  single-hue escalation ramp replaces the purple→yellow ramp.
- **Icons:** no emoji — clean line SVG icons (Lucide/Feather style) only where
  functional.
- **Map:** switch CartoDB Dark Matter tiles → Positron (light) to match.

### Planned (next steps on this branch)
- Restyle `css/styles.css` to the new tokens (light editorial), keeping the
  scrollytelling, sandbox, and charts intact.
- Restructure `index.html` to the editorial layout: title-page masthead,
  narrow reading measure with column-breaking figures, kickers, drop cap,
  pull quotes, and a references apparatus.
- Recolor the Chart.js / D3 / Leaflet visualizations to the editorial palette
  and switch to light map tiles.
- Remove emoji; add line SVG icons for source links and Hormuz status.
- QA against `DESIGN.md` and check `prefers-reduced-motion`.
