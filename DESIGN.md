# Design System — The 2026 Iran War: A Geoeconomic Autopsy

## Product Context
- **What this is:** A data-journalism autopsy of the 112-day 2026 Iran War (28 Feb – 20 Jun 2026) and its geoeconomic consequences — oil markets, the Strait of Hormuz, India's macro exposure, and the human toll.
- **Who it's for:** Analysts, journalists, policymakers, and an informed public; presented under an academic imprint.
- **Space/industry:** Editorial data journalism / institutional research. Peers in spirit: NYT graphics desk, Reuters Graphics, Bloomberg long-reads, The Pudding.
- **Project type:** Editorial (long-form scrollytelling article with interactive data visualization).
- **Published by:** Stepwell Centre for Asian Futures · Ahmedabad University. Research by Sahasrik Ragani.
- **Memorable thing (anchor):** *The definitive record.* Every choice serves authority, permanence, and citability — a document you could cite, not a dashboard.

## Aesthetic Direction
- **Direction:** Editorial / newspaper-of-record. Print-derived, calm, authoritative.
- **Decoration level:** Intentional — warm paper, hairline rules, small-caps kickers, drop cap, pull quotes, a citation apparatus. No textures, gradients, blobs, or neon.
- **Mood:** Serious and permanent. It should read as though an institution published it. This is a deliberate, near-total inversion of the previous dark "data terminal" theme (Space Grotesk + Space Mono + viridis neon on near-black).
- **No emoji.** Use clean 1.5px line SVG icons (Lucide/Feather style, `currentColor`, monochrome) only where functional: external-link arrow on source links, Hormuz status glyphs, sparse caption marks.
- **Reference feel:** NYT article/exposé — dramatic serif headline, calm serif body, Franklin sans furniture, narrow reading measure, figures that break the column.

## Typography
The editorial triad. This is the soul of the redesign.
- **Display/Hero:** **Fraunces** (variable, `font-optical-sizing:auto`, wght 600) — high-contrast old-style serif; engraved, document-of-record masthead character at title sizes. The memorable face.
- **Body:** **Newsreader** (variable, optical text sizes, wght 400) — built for on-screen news reading; calm and legible under the dramatic headline.
- **UI/Labels/Kickers/Captions:** **Libre Franklin** (wght 400/500/600/700) — open-source Franklin Gothic revival, the newspaper sans. Section kickers, chart labels, bylines, table headers, source lines. Use uppercase + letter-spacing for kickers.
- **Data/Tables:** **Libre Franklin** with `font-variant-numeric:tabular-nums`. Numbers align without a monospace.
- **Code:** n/a (no code surfaces). If ever needed: JetBrains Mono.
- **Retired:** Space Grotesk and Space Mono are removed entirely. The mono "receipts" signal is replaced by a real citation/footnote apparatus.
- **Loading:** Google Fonts —
  `https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Libre+Franklin:wght@400;500;600;700&display=swap`
- **Scale** (fluid where noted):
  - Masthead H1 (Fraunces 600): `clamp(3rem, 8vw, 5.75rem)` / line-height .98 / tracking -.015em
  - Section H2 (Fraunces 600): 2.1rem / 1.1
  - H3 (Fraunces 600): 1.5rem
  - Dek/standfirst (Newsreader): `clamp(1.2rem, 2.4vw, 1.5rem)` / 1.5, color muted
  - Body (Newsreader): 1.1875rem (19px) / 1.75, color body
  - Pull quote (Fraunces italic 400): 1.7rem / 1.28
  - Kicker (Libre Franklin 600): 12px / uppercase / tracking .14em
  - Caption & source (Libre Franklin): 11.5–13px, color muted/faint
  - Data numbers (Libre Franklin 600, tabular-nums): sized per context

## Color
- **Approach:** Restrained — paper + ink + one crisis accent + a link blue. Color is rare and meaningful.
- **Primary (crisis accent):** `#A61B1B` oxblood — crisis peaks, blockade states, falling direction, key figures. Replaces the neon viridis yellow. Deep tint `#7A1010`, light tint `#F2E4E1`.
- **Secondary (link):** `#326891` NYT link blue — links and interactive affordances.
- **Neutrals (warm):** paper `#FBFAF8` · surface `#FFFFFF` · inset `#F4F2EC` · rule `#E4E1DA` · rule-strong `#CFC9BC` · faint/baseline `#9A9488` · muted text `#6B6B6B` · body `#2B2B2B` · ink `#1A1A1A`.
- **Semantic:** success/resolution `#3E6B5E` (muted teal) · warning `#B8860B` (caution gold) · error/crisis `#A61B1B` · info `#326891`.
- **Data viz palette (replaces viridis):** categorical = ink `#1A1A1A` (primary series) · oxblood `#A61B1B` (crisis series) · slate-blue `#326891` (third series) · warm gray `#9A9488` (baseline). Charts use few colors, direct labeling over legends, hairline axes, faint or no gridlines.
- **Escalation/intensity ramp (map & heat):** single-hue warm sequential `#F2E4E1 → #A61B1B → #7A1010` (paper → oxblood → deep). Replaces the purple→yellow viridis ramp.
- **Map tiles:** switch CartoDB **Dark Matter → Positron (light)** to match the paper ground.
- **Dark mode ("night mode"):** warm charcoal, not the old neon. paper `#14120E` · surface `#1B1813` · rule `#332E26` · ink `#F1ECE2` · body `#DAD3C6` · muted `#9E978A` · crisis `#E06A5E` / deep `#C24A44` / tint `#2E1B18` · link `#8FB4D6`. Reduce accent saturation, keep the editorial restraint. Light is the default and canonical mode.

## Spacing
- **Base unit:** 8px (with a 4px sub-step).
- **Density:** Spacious for prose (body line-height 1.75), comfortable for data.
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64); section vertical rhythm 76–128px.

## Layout
- **Approach:** Creative-editorial / hybrid — narrow reading column, figures break out wide.
- **Grid:** 12-col underlying; content rhythm is "text column + figure breakout."
- **Max content width:** reading measure **660px** (~68 chars) for prose; **breakout ~1040px** for charts/tables; **full-bleed** for the scrollytelling map.
- **Structural signatures:** title-page masthead (poster first viewport), small-caps kickers with a hairline rule, drop cap on the opening paragraph, Fraunces-italic pull quotes between sections, `figure` blocks with a 2px ink top rule + Franklin kicker/caption + source line, superscript footnotes tied to a references apparatus.
- **Border radius:** minimal and hierarchical — sm 2px (buttons, badges, chips), md 3px (swatches/cards), figures/tables use rules not radius. Avoid rounded/bubbly forms.

## Motion
- **Approach:** Minimal-functional. Editorial = calm. Preserve the scrollytelling map (it is the content) but strip flashy transitions.
- **Easing:** enter `ease-out`, exit `ease-in`, move `ease-in-out`.
- **Duration:** micro 50–100ms · short 150–250ms · medium 250–400ms · long 400–700ms.
- **Rules:** reveal-on-scroll = subtle fade/slight rise (short, ease-out). Progress bar = thin ink/oxblood rule, not a neon gradient. Honor `prefers-reduced-motion: reduce` (disable non-essential motion).

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07-01 | Initial design system created | Created by /design-consultation. Overhaul from dark "data terminal" (Space Grotesk/Space Mono/viridis) to a light NYT-style editorial "document of record." |
| 2026-07-01 | Anchor = "the definitive record" | User-selected memorable thing; drives authority, restraint, and citation apparatus. |
| 2026-07-01 | Light editorial (true NYT) | User choice over dark or hybrid; paper/ink/one-accent. |
| 2026-07-01 | Type: Fraunces + Newsreader + Libre Franklin | Editorial triad; dramatic headline serif, calm body serif, Franklin sans furniture. Retire Space Grotesk/Mono. |
| 2026-07-01 | Oxblood `#A61B1B` replaces viridis neon | Restrained crisis accent; warm sequential ramp encodes escalation editorially. |
| 2026-07-01 | No emoji; line SVG icons only | User constraint; Lucide/Feather-style monochrome, functional use only. |
