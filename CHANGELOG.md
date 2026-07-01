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

### Fixed — scrollytelling map navigation

A round of QA on the scrollytelling map (the sticky timeline map driven by the
up/down "assist" arrows and the phase-legend pills) surfaced six defects. All
were verified fixed in a headless browser at both mobile (390–360px) and desktop
(1280px) viewports, with the overlay-vs-highlight invariant checked across full
navigation runs. The common thread: the map's active step was governed by an
IntersectionObserver where "the last step to intersect the active zone wins,"
which is non-deterministic during a programmatic smooth-scroll.

1. **Up-arrow highlighted one step too high (mobile).** The arrows set the
   highlight, then let the smooth-scroll run while the observer kept firing.
   Because the target rests ~14px below the active zone's top edge, the step
   *above* the target clips into that sliver — and only on an *up*-scroll does
   it enter the zone *last*, overriding the intended step. Fix: freeze the
   observer for the duration of an arrow/pill-driven scroll (`lockScrollyStep`)
   and pin the destination step explicitly; release on `scrollend` with a
   timeout fallback (also covers reduced-motion instant jumps).

2. **Assist buttons didn't advance the map on desktop.** The section-nav
   targeted only section-level elements, so `#scrollytelling` was a *single*
   target — one click entered the map and the next leapt past all 15 steps to
   the following section. Fix: include `.scroll-step` in the nav targets on
   every screen size so the arrows walk the map step-by-step everywhere.

3. **Assist buttons rendered as ovals on small screens.** The `≤600px` rule
   sized `.section-nav` — the flex *container* holding both buttons — to
   `44×44`, crushing the two stacked 46px buttons into a 44px box. Fix: size
   `.section-nav-btn` (44×44, `border-radius:50%`) instead of the container.

4. **Phase-pill jump highlighted the previous section.** Clicking a pill from
   far down the page scrolled back to the phase but the observer settled the
   highlight on the step *before* the one in view (a long up-jump is the worst
   case for "last intersecting wins"). Fix: `scrollToPhase` now pins its target
   step through the shared lock, which also **re-asserts the target when the
   scroll settles** and uses a longer (1.6s) timeout so a long jump can't outlast
   it.

5. **Orphan `COLLAPSE` pill went nowhere.** `collapse` is a legend colour and a
   map-marker phase, but its story is narrated *inside* the `ceasefire1` step
   ("Pakistan's Ceasefire — Then Collapse") — there is no dedicated `collapse`
   step, so the pill fell back to the top of the timeline. Fix: `stepForPhase`
   resolves a phase with no step to the nearest step by escalation order;
   `COLLAPSE` now lands on the ceasefire-collapse step.

6. **First step looked active before the reader engaged.** On load the first
   step was half-primed (highlighted + map marker) while the overlay still
   showed its "Scroll to begin the timeline →" call-to-action — an apparent
   desync. Fix: drop the half-priming. The intro now shows the CTA over an
   overview map with nothing highlighted; the observer and section-nav activate
   the first real step the moment it scrolls into the reading zone.
