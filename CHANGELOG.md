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
- **Color:** replace viridis neon with paper + ink and a single restrained
  **oxblood `#A61B1B`** crisis accent, plus an NYT link blue `#326891`; a warm
  single-hue escalation ramp replaces the purple→yellow ramp.
- **Icons:** no emoji — clean line SVG icons (Lucide/Feather style) only where
  functional.
- **Map:** switch CartoDB Dark Matter tiles → Positron (light) to match; a
  brightness filter lifts borders/labels in dark mode.

### Typography evolution
The header/body pairing went through three iterations, kept legible here:
1. **Original** — Space Grotesk + Space Mono (the dark data-terminal look).
2. **First editorial pass** — Fraunces (display) + Newsreader (body) + Libre
   Franklin (UI): a true newspaper triad.
3. **Final** — **Crimson Pro** (headers) + **Work Sans** (body). Candidate
   pairings were loaded into a live typography playground (built in Gemini,
   kept at `design/editorial-typography-playground.tsx`), viewed against the
   real masthead / body / kicker roles, and Crimson Pro + Work Sans was chosen
   for its cleaner serif-display vs. humanist-sans contrast. In the tokens,
   `--font-display` = Crimson Pro and `--font-read` / `--font-sans` = Work Sans.

### Also shipped on this branch (beyond the initial redesign)
- Full light/dark ("night mode") toggle with chart + map re-theming.
- Sticky, clickable conflict-phase navigation with active-step highlighting.
- Author + fork/redesign credits with portraits (Sahasrik Ragani in the
  byline; Jeremy Fritzhand in the footer) and GitHub/LinkedIn links.
- Mobile pass: stacked header, single-row phase legend, sticky scrollytelling
  map, and a floating up/down section-nav ("map tab") assist.
