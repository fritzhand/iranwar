/**
 * app.js — The 2026 Iran War: A Geoeconomic Autopsy
 * Stepwell Centre for Asian Futures · Ahmedabad University
 * Author: Sahasrik Ragani
 *
 * Sections:
 *   1. Constants & Helpers
 *   2. Progress Bar
 *   3. Phase Legend
 *   4. Scrollytelling Map (Leaflet)
 *   5. Scroll Steps — Build & Observe
 *   6. Sandbox Map (Leaflet)
 *   7. Timeline Slider
 *   8. Sankey Drawing Engine (Custom SVG)
 *   9. Sankey Renders — India & Global
 *  10. Chart.js Charts (13 charts)
 *  11. Geopolitical Cost Table
 *  12. Main Init
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   1. CONSTANTS & HELPERS
═══════════════════════════════════════════════════════════════ */

/* Editorial categorical/escalation palette — replaces viridis.
   Ordered low→high salience; chosen so multi-series charts stay
   distinguishable in editorial tones (gray → blue/teal → ink → oxblood). */
const V = {
  v0:'#C9C3B6', v1:'#9A9488', v2:'#326891', v3:'#3E6B5E',
  v4:'#8A8478', v5:'#1A1A1A', v6:'#B8860B', v7:'#C8756B',
  v8:'#7A1010', v9:'#A61B1B'
};

/* Phase colors — editorial escalation (calm → crisis → resolution) */
const PC = {
  outbreak:'#9A9488', closure:'#C8756B', escalation:'#BC4C41',
  peak:'#A61B1B',     stalemate:'#8A8478', ceasefire1:'#3E6B5E',
  collapse:'#7A1010', blockade:'#4A0909', relapse:'#BC4C41',
  resolution:'#3E6B5E', recovery:'#5E8A79'
};

/* Day offset from Feb 28 = day 0 (2026 is not a leap year) */
const M_OFF = { Jan:-31, Feb:-28, Mar:0, Apr:31, May:61, Jun:92 };

function dayOf(str) {
  if (!str) return 0;
  const p = str.trim().split(/[\s,]+/);
  const mon = (p[0] || '').substring(0, 3);
  const d   = parseInt(p[1]) || 0;
  return (M_OFF[mon] ?? 0) + d;
}

function getHormuzStatus(day) {
  if (day <= 1)               return 'open';
  if (day <= 37)              return 'closed';
  if (day <= 43)              return 'open';       // Pakistan ceasefire
  if (day <= 101)             return 'blockaded';  // US naval blockade
  if (day <= 103)             return 'closed';     // Jun 10 relapse
  if (day <= 109)             return 'opening';    // diplomacy
  return 'open';                                   // post-MoU
}

/* Chart.js global editorial (light) defaults */
Chart.defaults.color          = '#6B6B6B';
Chart.defaults.borderColor    = '#E4E1DA';
Chart.defaults.font.family    = "'Work Sans', system-ui, sans-serif";
Chart.defaults.font.size      = 11;

const TIP = {
  backgroundColor:'#FFFFFF', borderColor:'#E4E1DA', borderWidth:1,
  titleColor:'#1A1A1A', bodyColor:'#2B2B2B', padding:12,
  titleFont:{ family:"'Work Sans', sans-serif", weight:'600', size:12 },
  bodyFont:{ family:"'Work Sans', sans-serif", size:11 }
};

function mkScale(overrides = {}) {
  return {
    grid:  { color:'#EEEBE4' },
    ticks: { color:'#6B6B6B', font:{ family:"'Work Sans', sans-serif", size:10 } },
    ...overrides
  };
}

/* ── Theme (light / dark) ── */
const CHARTS = [];
function mkChart(ctx, cfg) {
  const c = new Chart(ctx, cfg);
  CHARTS.push(c);
  return c;
}

let scrollTileLayer  = null;
let sandboxTileLayer = null;

function isDark() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

function tileURL() {
  const style = isDark() ? 'dark_all' : 'light_all';
  return `https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png`;
}

/* Re-theme every Chart.js instance for the current mode */
function applyChartTheme(dark) {
  const grid     = dark ? '#332E26' : '#EEEBE4';
  const tick     = dark ? '#9E978A' : '#6B6B6B';
  const inkLight = '#F1ECE2';
  const inkDark  = '#1A1A1A';
  Chart.defaults.color       = tick;
  Chart.defaults.borderColor = grid;

  /* swap the ink series tone (v5) so it stays visible on either ground,
     preserving any alpha suffix */
  const swap = c => {
    if (typeof c !== 'string') return c;
    const lc = c.toLowerCase();
    if (lc.startsWith('#1a1a1a') || lc.startsWith('#f1ece2')) {
      return (dark ? inkLight : inkDark) + c.slice(7);
    }
    return c;
  };

  CHARTS.forEach(ch => {
    ['x', 'y', 'y1'].forEach(ax => {
      const s = ch.options.scales && ch.options.scales[ax];
      if (!s) return;
      if (s.grid)  s.grid.color  = grid;
      if (s.ticks) s.ticks.color = tick;
      if (s.title) s.title.color = tick;
    });
    const tt = ch.options.plugins && ch.options.plugins.tooltip;
    if (tt) {
      tt.backgroundColor = dark ? '#1B1813' : '#FFFFFF';
      tt.borderColor     = grid;
      tt.titleColor      = dark ? '#F1ECE2' : '#1A1A1A';
      tt.bodyColor       = dark ? '#DAD3C6' : '#2B2B2B';
    }
    (ch.data.datasets || []).forEach(ds => {
      ds.borderColor     = Array.isArray(ds.borderColor)     ? ds.borderColor.map(swap)     : swap(ds.borderColor);
      ds.backgroundColor = Array.isArray(ds.backgroundColor) ? ds.backgroundColor.map(swap) : swap(ds.backgroundColor);
    });
    ch.update('none');
  });
}

/* Swap map tiles for the current mode */
function applyMapTheme() {
  const url = tileURL();
  if (scrollTileLayer)  scrollTileLayer.setUrl(url);
  if (sandboxTileLayer) sandboxTileLayer.setUrl(url);
}

const SUN_SVG  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const MOON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  const dark = t === 'dark';
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.innerHTML = `<span class="toggle-icon" aria-hidden="true">${dark ? SUN_SVG : MOON_SVG}</span>` +
                    `<span class="toggle-label">${dark ? 'Day' : 'Night'}</span>`;
    btn.setAttribute('aria-label', dark ? 'Switch to day mode' : 'Switch to night mode');
  }
  applyChartTheme(dark);
  applyMapTheme();
}

function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  /* the head script already set the attribute; sync UI + canvas + maps */
  applyTheme(isDark() ? 'dark' : 'light');
  if (btn) btn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('iw-theme', next); } catch (e) {}
    applyTheme(next);
  });
}

/* ═══════════════════════════════════════════════════════════════
   2. PROGRESS BAR
═══════════════════════════════════════════════════════════════ */
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const dH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${dH > 0 ? Math.min(window.scrollY / dH, 1) : 0})`;
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════════
   3. PHASE LEGEND
═══════════════════════════════════════════════════════════════ */
function buildPhaseLegend() {
  const c = document.getElementById('phase-pills-container');
  if (!c) return;
  Object.entries(PC).forEach(([phase, color]) => {
    const el = document.createElement('a');
    el.className = 'phase-pill';
    el.dataset.phase = phase;
    el.setAttribute('role', 'link');
    el.setAttribute('tabindex', '0');
    el.href = '#scrollytelling';
    el.title = `Jump to ${phase.replace(/\d/g,'').toUpperCase()} in the timeline`;
    el.innerHTML = `<span class="dot" style="background:${color};opacity:1"></span>${phase.replace(/\d/g,'').toUpperCase()}`;
    el.addEventListener('click', e => { e.preventDefault(); scrollToPhase(phase); });
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToPhase(phase); }
    });
    c.appendChild(el);
  });
}

/* Smooth-scroll to the first timeline step of a given phase */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* Resolve a phase to its timeline step. Most phases have a dedicated step;
   `collapse` exists only as a map marker / legend colour (the ceasefire's
   collapse is narrated inside the ceasefire1 step), so fall back to the nearest
   step by escalation order rather than dumping the reader at the top of the
   timeline. */
function stepForPhase(phase) {
  const exact = document.querySelector(`.scroll-step[data-phase="${phase}"]`);
  if (exact) return exact;
  const order = Object.keys(PC);
  const want  = order.indexOf(phase);
  if (want === -1) return null;
  let best = null, bestDist = Infinity;
  document.querySelectorAll('.scroll-step').forEach(s => {
    const oi = order.indexOf(s.dataset.phase);
    if (oi === -1) return;
    const dist = Math.abs(oi - want);
    if (dist < bestDist) { best = s; bestDist = dist; }  // ties keep the earlier (document-order) step
  });
  return best;
}

function scrollToPhase(phase) {
  const target = stepForPhase(phase) || document.getElementById('scrollytelling');
  if (!target) return;
  const legendH = document.getElementById('phase-legend')?.offsetHeight || 48;
  const y = target.getBoundingClientRect().top + window.scrollY - navHeight() - legendH - 16;
  /* Pin the target step as active through the scroll — otherwise a long jump
     (esp. up from the bottom of the page) lets the observer settle the
     highlight on the previous step relative to the viewable area. */
  if (target.classList.contains('scroll-step')) lockScrollyStep(target);
  window.scrollTo({ top: Math.max(y, 0), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

/* Highlight the phase pill matching the active timeline step, and (when the
   legend is a horizontal scroller on mobile) bring that pill into view. */
function highlightPhasePill(phase) {
  const scroller = document.getElementById('phase-legend');
  document.querySelectorAll('#phase-pills-container .phase-pill').forEach(p => {
    const on = p.dataset.phase === phase;
    p.classList.toggle('is-current', on);
    if (on && scroller && scroller.scrollWidth > scroller.clientWidth + 4) {
      const cRect = scroller.getBoundingClientRect();
      const pRect = p.getBoundingClientRect();
      const target = scroller.scrollLeft + (pRect.left - cRect.left) - (cRect.width / 2) + (pRect.width / 2);
      scroller.scrollTo({ left: Math.max(target, 0), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  });
}

function navHeight() {
  return document.getElementById('main-nav')?.offsetHeight || 56;
}

/* Publish the live nav height so sticky offsets (CSS var --nav-h) adapt to
   the stacked mobile header. */
function setNavHeightVar() {
  document.documentElement.style.setProperty('--nav-h', navHeight() + 'px');
}

/* Toggle a shadow on the phase legend once it sticks under the nav */
function initStickyLegend() {
  const sentinel = document.getElementById('phase-legend-sentinel');
  const legend   = document.getElementById('phase-legend');
  if (!sentinel || !legend || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    ([entry]) => legend.classList.toggle('is-stuck', !entry.isIntersecting),
    { rootMargin: `-${navHeight()}px 0px 0px 0px`, threshold: 0 }
  );
  io.observe(sentinel);
}

/* Floating scroll assist (bottom-right, up + down). On mobile it steps through
   each scrollytelling step (map tab); on desktop it jumps section to section. */
function initSectionNav() {
  const nav  = document.getElementById('section-nav');
  const up   = document.getElementById('section-nav-up');
  const down = document.getElementById('section-nav-down');
  if (!nav || !up || !down) return;

  const SECTION_SEL = '#lede, #scrollytelling, section.chart-section-bg, section:not([id]):not(.chart-section-bg), #sandbox, #resolution-footer';

  /* Steps are nav targets on every screen size so the arrows walk through the
     map narrative step-by-step (on desktop the sticky map otherwise gets jumped
     past in one leap, section-to-section, and never advances). */
  const targets = () =>
    Array.from(document.querySelectorAll(SECTION_SEL + ', .scroll-step')); // document order

  /* A step must clear the sticky map on mobile to be readable */
  const readingOffset = el => {
    if (el.classList.contains('scroll-step') && window.innerWidth <= 900) {
      const legend = document.getElementById('phase-legend');
      const fig    = document.querySelector('.sticky-figure');
      return navHeight() + (legend?.offsetHeight || 0) + (fig?.offsetHeight || 0) + 14;
    }
    return navHeight() + 8;
  };

  const destOf   = el => el.getBoundingClientRect().top + window.scrollY - readingOffset(el);
  const scrollToY = y => window.scrollTo({ top: Math.max(y, 0), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });

  /* scroll to a target and, if it's a step, sync the map/highlight immediately
     so the arrows never leave the active step out of sync with the reading area */
  const goTo = t => {
    if (!t) return;
    /* Freeze the scrolly observer and pin the step so an intermediate step
       can't override it mid-scroll. On up-scroll the step above the target
       dips into the top of the active zone last (the target rests ~14px below
       the zone top) and would otherwise win, landing the map one step too high. */
    if (t.el.classList.contains('scroll-step')) lockScrollyStep(t.el);
    scrollToY(t.y);
  };

  down.addEventListener('click', () => {
    const next = targets().map(el => ({ el, y: destOf(el) }))
      .filter(o => o.y > window.scrollY + 24).sort((a, b) => a.y - b.y)[0];
    next ? goTo(next) : scrollToY(document.body.scrollHeight);
  });

  up.addEventListener('click', () => {
    const prev = targets().map(el => ({ el, y: destOf(el) }))
      .filter(o => o.y < window.scrollY - 24).sort((a, b) => b.y - a.y)[0];
    prev ? goTo(prev) : scrollToY(0);
  });

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-visible', y > window.innerHeight * 0.45);
    up.classList.toggle('is-disabled', y <= 24);
    down.classList.toggle('is-disabled', (window.innerHeight + y) >= document.body.scrollHeight - 4);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ═══════════════════════════════════════════════════════════════
   4. SCROLLYTELLING MAP
═══════════════════════════════════════════════════════════════ */
let scrollMap     = null;
const scrollMkrs  = {};
let prevActiveId  = null;

function initScrollMap() {
  const el = document.getElementById('scroll-map-container');
  if (!el || typeof L === 'undefined') return;

  scrollMap = L.map('scroll-map-container', {
    center:[27, 50], zoom:5,
    zoomControl:false, scrollWheelZoom:false,
    dragging:false, touchZoom:false, doubleClickZoom:false, keyboard:false
  });

  scrollTileLayer = L.tileLayer(tileURL(), {
    attribution:'&copy; <a href="https://openstreetmap.org">OSM</a> &copy; <a href="https://carto.com">CARTO</a>',
    subdomains:'abcd', maxZoom:14
  }).addTo(scrollMap);

  (crisisData.mapEvents || []).forEach(ev => {
    const color = PC[ev.phase] || V.v3;
    const m = L.circleMarker([ev.lat, ev.lng], {
      radius:5, fillColor:color,
      color:'rgba(26,26,26,0.35)', weight:1,
      fillOpacity:0.75, opacity:1
    }).bindPopup(
      `<div class="map-popup-date">${ev.date} · ${(ev.phase||'').toUpperCase()}</div>` +
      `<div class="map-popup-title">${ev.title}</div>` +
      `<div class="map-popup-body">${ev.body}</div>` +
      `<div class="map-popup-source">${ev.source}</div>`,
      { maxWidth:280 }
    ).addTo(scrollMap);
    scrollMkrs[ev.id] = { m, color };
  });
}

function activateMapStep(step) {
  if (!scrollMap) return;

  /* Reset previous */
  if (prevActiveId && scrollMkrs[prevActiveId]) {
    const p = scrollMkrs[prevActiveId];
    p.m.setRadius(5);
    p.m.setStyle({ fillOpacity:0.75, weight:1, color:'rgba(26,26,26,0.35)' });
  }

  /* Activate new */
  const ev = (crisisData.mapEvents || []).find(e => e.id === step.eventId);
  if (ev && scrollMkrs[ev.id]) {
    const cur = scrollMkrs[ev.id];
    cur.m.setRadius(12);
    cur.m.setStyle({ fillOpacity:1, weight:2.5, color:'#1A1A1A' });
    prevActiveId = ev.id;
  }

  /* Fly */
  if (step.flyTo && scrollMap) {
    scrollMap.flyTo(step.flyTo, step.zoom || 6, { animate:true, duration:1.1 });
  }
}

/* ═══════════════════════════════════════════════════════════════
   5. SCROLL STEPS — BUILD & OBSERVE
═══════════════════════════════════════════════════════════════ */
function buildScrollSteps() {
  const container = document.getElementById('scroll-steps-container');
  if (!container) return;

  (crisisData.scrollSteps || []).forEach((step, idx) => {
    const color = PC[step.phase] || V.v3;
    const isLight = color === V.v8 || color === V.v9;
    const el = document.createElement('div');
    el.className = 'scroll-step';
    el.dataset.idx = idx;
    el.dataset.phase = step.phase || '';
    el.style.borderLeftColor = color;
    el.innerHTML = `
      <div class="step-phase-date" style="color:${color}">
        ${step.date}&nbsp;&nbsp;·&nbsp;&nbsp;${(step.phase||'').toUpperCase()}
      </div>
      <h3 class="step-headline">${step.headline}</h3>
      <p class="step-narrative">${step.narrative}</p>
      <div class="step-metrics">
        <div class="step-metric-chip"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>Brent <strong>$${step.metric_brent}</strong>/bbl</div>
        <div class="step-metric-chip"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>Oman <strong>$${step.metric_oman}</strong>/bbl</div>
        ${step.metric_note ? `<div class="step-metric-chip"><em style="color:#6B6B6B">${step.metric_note}</em></div>` : ''}
      </div>
      <p class="step-source">
        ${((crisisData.mapEvents||[]).find(e => e.id === step.eventId)||{}).source || ''}
      </p>`;
    container.appendChild(el);
  });
}

/* Exposed so the section-nav can activate the exact step it jumps to */
let setActiveStep = null;
let _scrollyObserver = null;

/* When the arrows or a phase pill drive a programmatic scroll we freeze the
   observer and pin the destination step as active. Otherwise "last intersecting
   step wins": on up-scroll the step just above the target clips into the top of
   the active zone last (the target rests ~14px below the zone top) and on a long
   jump (e.g. a pill click from the bottom of the page) an intermediate step
   settles the highlight on the wrong section for the viewable area.
   The target is re-asserted when the scroll settles (scrollend, with a timeout
   fallback for browsers without it and for reduced-motion instant jumps) so a
   scroll that outlasts the timeout still lands on the right step. */
let _navScrollLock  = false;
let _navLockTimer   = null;
let _navLockRelease = null;

function lockScrollyStep(target) {
  _navScrollLock = true;
  if (target && typeof setActiveStep === 'function') setActiveStep(target);
  if (_navLockRelease) window.removeEventListener('scrollend', _navLockRelease);
  clearTimeout(_navLockTimer);
  _navLockRelease = () => {
    clearTimeout(_navLockTimer);
    window.removeEventListener('scrollend', _navLockRelease);
    _navLockRelease = null;
    /* re-assert in case the timeout released the lock mid-scroll and the
       observer moved the highlight off target before it settled */
    const cur = document.querySelector('.scroll-step.is-active');
    if (target && cur !== target && typeof setActiveStep === 'function') setActiveStep(target);
    _navScrollLock = false;
  };
  window.addEventListener('scrollend', _navLockRelease);
  _navLockTimer = setTimeout(_navLockRelease, 1600);
}

/* Active zone for the observer. On mobile it must sit BELOW the sticky map,
   otherwise a step scrolling behind the map counts as "active" and the map
   shows a step that's above the one being read. */
function scrollyRootMargin() {
  if (window.innerWidth <= 900) {
    const legend = document.getElementById('phase-legend');
    const fig    = document.querySelector('.sticky-figure');
    const top    = navHeight() + (legend?.offsetHeight || 0) + (fig?.offsetHeight || 0);
    const bottom = Math.max(window.innerHeight - top - Math.round(window.innerHeight * 0.22), 60);
    return `-${top}px 0px -${bottom}px 0px`;
  }
  return '-8% 0px -28% 0px';
}

function initScrollytelling() {
  const steps = document.querySelectorAll('.scroll-step');
  if (!steps.length) return;

  const oDate     = document.getElementById('map-overlay-date');
  const oHeadline = document.getElementById('map-overlay-headline');
  const oBrent    = document.getElementById('map-overlay-brent');
  const oOman     = document.getElementById('map-overlay-oman');

  setActiveStep = target => {
    const idx  = +target.dataset.idx;
    const step = (crisisData.scrollSteps || [])[idx];
    if (!step) return;
    steps.forEach(s => s.classList.remove('is-active'));
    target.classList.add('is-active');
    highlightPhasePill(step.phase);
    activateMapStep(step);
    if (oDate)     oDate.textContent     = `${step.date} · ${(step.phase||'').toUpperCase()}`;
    if (oHeadline) oHeadline.textContent = step.headline;
    if (oBrent)    oBrent.textContent    = `$${step.metric_brent}`;
    if (oOman)     oOman.textContent     = `$${step.metric_oman}`;
  };

  const build = () => {
    if (_scrollyObserver) _scrollyObserver.disconnect();
    _scrollyObserver = new IntersectionObserver(entries => {
      if (_navScrollLock) return;   // arrow nav in flight — highlight is set explicitly
      entries.forEach(entry => { if (entry.isIntersecting) setActiveStep(entry.target); });
    }, { threshold: 0, rootMargin: scrollyRootMargin() });
    steps.forEach(s => _scrollyObserver.observe(s));
  };
  build();

  /* the active zone depends on nav + map heights — rebuild on resize */
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════════
   6. SANDBOX MAP
═══════════════════════════════════════════════════════════════ */
let sandboxMap       = null;
let hormuzMarker     = null;

function initSandboxMap() {
  const el = document.getElementById('sandbox-map-container');
  if (!el || typeof L === 'undefined') return;

  sandboxMap = L.map('sandbox-map-container', {
    center:[27, 53], zoom:5,
    zoomControl:true, scrollWheelZoom:false
  });

  sandboxTileLayer = L.tileLayer(tileURL(), {
    attribution:'&copy; <a href="https://openstreetmap.org">OSM</a> &copy; <a href="https://carto.com">CARTO</a>',
    subdomains:'abcd', maxZoom:14
  }).addTo(sandboxMap);

  /* All strike markers — always visible, always clickable */
  (crisisData.mapEvents || []).forEach(ev => {
    const color = PC[ev.phase] || V.v3;
    L.circleMarker([ev.lat, ev.lng], {
      radius:5, fillColor:color,
      color:'rgba(26,26,26,0.25)', weight:1, fillOpacity:0.7
    }).bindPopup(
      `<div class="map-popup-date">${ev.date} · ${(ev.phase||'').toUpperCase()}</div>` +
      `<div class="map-popup-title">${ev.title}</div>` +
      `<div class="map-popup-body">${ev.body}</div>`,
      { maxWidth:260 }
    ).addTo(sandboxMap);
  });

  /* Hormuz status indicator */
  hormuzMarker = L.circleMarker([26.34, 56.50], {
    radius:16, fillColor:V.v5,
    color:'#1A1A1A', weight:2, fillOpacity:0.85
  }).bindTooltip('Strait of Hormuz', { permanent:false, direction:'top' })
    .addTo(sandboxMap);
}

function updateSandboxMap(status) {
  if (!hormuzMarker) return;
  const c = { open:V.v5, closed:V.v9, blockaded:V.v2, threatened:V.v7, opening:V.v6 };
  hormuzMarker.setStyle({ fillColor: c[status] || V.v5 });
}

/* ═══════════════════════════════════════════════════════════════
   7. TIMELINE SLIDER
═══════════════════════════════════════════════════════════════ */
function closestByDay(arr, day, dateFn) {
  if (!arr || !arr.length) return null;
  return arr.reduce((best, cur) => {
    const bd = Math.abs(dateFn(best) - day);
    const cd = Math.abs(dateFn(cur)  - day);
    return cd < bd ? cur : best;
  });
}

function initSlider() {
  const slider = document.getElementById('crisis-slider');
  if (!slider) return;
  slider.addEventListener('input', () => updateSlider(+slider.value), { passive:true });
  updateSlider(0);
}

function updateSlider(day) {
  /* Derive data from closest data points */
  const oil = closestByDay(crisisData.oilPrices,       day, d => dayOf(d.date));
  const fx  = closestByDay(crisisData.fxReserves,      day, d => dayOf(d.date));
  // Filter null-ship entries separately so slider never shows 0 for vessels when data exists
  const mar         = closestByDay(crisisData.marinersStranded,                            day, d => dayOf(d.date));
  const marShips    = closestByDay(crisisData.marinersStranded.filter(d => d.ships != null), day, d => dayOf(d.date));
  const ev  = (crisisData.events || []).filter(e => e.day <= day).slice(-1)[0]
           || (crisisData.events||[])[0];

  const status = getHormuzStatus(day);
  const label  = oil?.date || 'Feb 28';

  /* Date label + badge */
  const dEl = document.getElementById('slider-date-text') || document.getElementById('slider-date-label');
  if (dEl) dEl.textContent = `${label} · Day ${day}`;

  const badge = document.getElementById('hormuz-badge');
  if (badge) {
    badge.textContent = `HORMUZ: ${status.toUpperCase()}`;
    badge.className   = `hormuz-badge ${['open','opening'].includes(status) ? 'open' : status === 'blockaded' ? 'blockaded' : 'closed'}`;
  }

  /* Stat cards */
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  set('stat-brent',   `$${(oil?.brent   ?? 74.2).toFixed(1)}`);
  set('stat-oman',    `$${(oil?.oman    ?? 73.8).toFixed(1)}`);
  set('stat-wti',     `$${(oil?.wti     ?? 70.1).toFixed(1)}`);
  set('stat-fx',      `$${(fx?.value    ?? 730).toFixed(1)}B`);
  set('stat-ships',   (marShips?.ships    ?? 0).toLocaleString());
  set('stat-mariners',(mar?.mariners ?? 0).toLocaleString());

  /* Event card */
  const evH = document.getElementById('sandbox-event-headline');
  const evB = document.getElementById('sandbox-event-body');
  if (ev) {
    if (evH) evH.textContent = ev.headline || '—';
    if (evB) evB.textContent = ev.body || '—';
  }

  updateSandboxMap(status);
}

/* ═══════════════════════════════════════════════════════════════
   8. SANKEY DRAWING ENGINE (Custom SVG — no external lib)
═══════════════════════════════════════════════════════════════ */
function drawSankey(svgId, { nodes, links }, colHeaders = [], opts = {}) {
  const svgEl = document.getElementById(svgId);
  if (!svgEl) return;

  /* Dimensions */
  const W  = Math.max(svgEl.parentElement?.clientWidth || 0, 680);
  const H  = parseInt(svgEl.style.height) || 380;
  const PAD = { top:40, right:128, bottom:10, left:10 };
  const NW  = 14;   /* node width */
  const NG  = 9;    /* node gap */

  const numCols = Math.max(...nodes.map(n => n.col)) + 1;
  const iW = W - PAD.left - PAD.right;   /* inner width */
  const iH = H - PAD.top  - PAD.bottom;  /* inner height */
  const colSpan = iW / (numCols - 1);

  /* Compute incoming/outgoing totals per node */
  const nd = nodes.map((n, i) => ({ ...n, idx:i, inV:0, outV:0, val:0 }));
  links.forEach(lk => { nd[lk.source].outV += lk.value; nd[lk.target].inV += lk.value; });
  nd.forEach(n => {
    n.val = n.col === 0            ? n.outV
          : n.col === numCols - 1  ? n.inV
          : Math.max(n.inV, n.outV);
  });

  /* Group nodes by column, compute y-positions */
  const byCol = {};
  nd.forEach(n => (byCol[n.col] = byCol[n.col] || []).push(n));

  const pos = {};
  for (let c = 0; c < numCols; c++) {
    const cns  = byCol[c] || [];
    const tot  = cns.reduce((s, n) => s + n.val, 0) || 1;
    const usable = iH - NG * (cns.length - 1);
    const xBase  = c === numCols - 1
      ? PAD.left + iW - NW
      : PAD.left + c * colSpan;
    let y = PAD.top;
    cns.forEach(n => {
      const h = Math.max((n.val / tot) * usable, 8);
      pos[n.idx] = { x:xBase, y, h, midY: y + h / 2, color: n.color || '#6B6B6B' };
      y += h + NG;
    });
  }

  /* Build SVG via DOM (ensures clean re-render) */
  const NS = 'http://www.w3.org/2000/svg';
  svgEl.innerHTML = '';
  svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svgEl.setAttribute('width', W);
  svgEl.setAttribute('height', H);

  /* Track stacking offsets per node */
  const srcOff = {}, tgtOff = {};
  nd.forEach(n => { srcOff[n.idx] = 0; tgtOff[n.idx] = 0; });

  /* ── LINKS ── */
  links.forEach(lk => {
    const s = pos[lk.source];
    const t = pos[lk.target];
    if (!s || !t) return;

    const sN  = nd[lk.source];
    const tN  = nd[lk.target];
    const sh  = (lk.value / (sN.outV || 1)) * s.h;
    const th  = (lk.value / (tN.inV  || 1)) * t.h;
    const x0  = s.x + NW;
    const y0  = s.y + srcOff[lk.source];
    const x1  = t.x;
    const y1  = t.y + tgtOff[lk.target];

    srcOff[lk.source] += sh;
    tgtOff[lk.target] += th;

    const cx = (x0 + x1) / 2;
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d',
      `M${x0} ${y0} C${cx} ${y0},${cx} ${y1},${x1} ${y1}` +
      `L${x1} ${y1 + th} C${cx} ${y1 + th},${cx} ${y0 + sh},${x0} ${y0 + sh}Z`
    );
    path.setAttribute('class', 'sankey-link');
    path.style.fill        = s.color;
    path.style.fillOpacity = '0.38';
    path.style.stroke      = 'none';
    svgEl.appendChild(path);
  });

  /* ── NODES + LABELS ── */
  nodes.forEach((n, i) => {
    const p = pos[i];
    if (!p) return;

    /* Node rect */
    const rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('x', p.x);   rect.setAttribute('y', p.y);
    rect.setAttribute('width', NW); rect.setAttribute('height', p.h);
    rect.setAttribute('fill', p.color); rect.setAttribute('rx', '2');
    svgEl.appendChild(rect);

    /* Label */
    const isLast = n.col === numCols - 1;
    const lx     = isLast ? p.x - 5 : p.x + NW + 5;
    const lines  = n.name.split('\n');
    const lh     = 11;
    const ly0    = p.midY - (lines.length - 1) * lh / 2 + 3;

    lines.forEach((line, li) => {
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', lx);
      t.setAttribute('y', ly0 + li * lh);
      t.setAttribute('text-anchor', isLast ? 'end' : 'start');
      t.setAttribute('fill', '#6B6B6Baaa');
      t.setAttribute('font-size', '9');
      t.setAttribute('font-family', "'Work Sans', sans-serif");
      t.textContent = line;
      svgEl.appendChild(t);
    });
  });

  /* ── COLUMN HEADERS ── */
  colHeaders.forEach((hdr, c) => {
    const isLast = c === numCols - 1;
    const xBase  = isLast
      ? PAD.left + iW - NW
      : PAD.left + c * colSpan;
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', isLast ? xBase + NW : xBase);
    t.setAttribute('y', PAD.top - 14);
    t.setAttribute('text-anchor', isLast ? 'end' : 'start');
    t.setAttribute('fill', '#6B6B6B555');
    t.setAttribute('font-size', '8.5');
    t.setAttribute('font-family', "'Work Sans', sans-serif");
    t.setAttribute('font-weight', '700');
    t.setAttribute('letter-spacing', '1');
    t.textContent = hdr.toUpperCase();
    svgEl.appendChild(t);
  });

  /* ── OPTIONAL BLOCKED LABEL (Global Sankey) ── */
  if (opts.blocked) {
    const bx = PAD.left + colSpan + 4;
    const by = PAD.top - 2;
    const bg = document.createElementNS(NS, 'rect');
    bg.setAttribute('x', bx - 3); bg.setAttribute('y', by - 13);
    bg.setAttribute('width', 126); bg.setAttribute('height', 16);
    bg.setAttribute('fill', '#2a0808'); bg.setAttribute('rx', '2');
    svgEl.appendChild(bg);
    const bt = document.createElementNS(NS, 'text');
    bt.setAttribute('x', bx); bt.setAttribute('y', by);
    bt.setAttribute('fill', '#fde725'); bt.setAttribute('font-size', '8');
    bt.setAttribute('font-family', "'Work Sans', sans-serif");
    bt.setAttribute('font-weight', '700');
    bt.textContent = 'BLOCKED Mar 1 – present';
    svgEl.appendChild(bt);
  }
}

/* ═══════════════════════════════════════════════════════════════
   9. SANKEY RENDERS
═══════════════════════════════════════════════════════════════ */
let currentSankeyMode = 'normal';

function renderSankeyIndia(mode) {
  currentSankeyMode = mode;
  const d = crisisData.sankeyIndia;
  if (!d) return;

  let { nodes, links } = d;

  if (mode === 'crisis') {
    /* Crisis routing: Hormuz blocked, Russia/Non-Hormuz surges */
    links = d.links.map(lk => {
      const l = { ...lk };
      if (lk.target === 6) l.value = Math.max(Math.floor(lk.value * 0.35), 1); // Via Hormuz shrinks 65%
      if (lk.target === 7 && lk.source === 1) l.value = lk.value + 8;           // Russia surge
      if (lk.target === 7 && lk.source === 5) l.value = lk.value + 10;          // Other Non-Hormuz surge
      return l;
    });

    /* Update route node labels for crisis view */
    nodes = d.nodes.map(n => {
      if (n.name === 'Via Hormuz 56%') return { ...n, name:'Via Hormuz\n~20%', color:'#c0392b' };
      if (n.name === 'Non-Hormuz 44%') return { ...n, name:'Non-Hormuz\n~80%', color:'#2e86ab' };
      return n;
    });
  }

  drawSankey('sankey-india-svg', { nodes, links },
    ['SOURCE', 'ROUTE', 'COMMODITY', 'DESTINATION']);

  const nb = document.getElementById('sankey-india-normal-btn');
  const cb = document.getElementById('sankey-india-crisis-btn');
  if (nb) { nb.classList.toggle('active', mode === 'normal'); }
  if (cb) { cb.classList.toggle('active', mode === 'crisis'); }
}

function renderSankeyGlobal() {
  const d = crisisData.sankeyGlobal;
  if (!d) return;
  drawSankey('sankey-global-svg', d,
    ['ORIGIN', 'STRAIT / ROUTE', 'DESTINATION'],
    { blocked: true });
}

/* ═══════════════════════════════════════════════════════════════
   10. CHART.JS CHARTS
═══════════════════════════════════════════════════════════════ */

/* ── 1. Oil Prices — Full Timeline ── */
function initOilChart() {
  const ctx = document.getElementById('chart-oil-prices');
  if (!ctx) return;
  const D = crisisData.oilPrices;
  mkChart(ctx, {
    type:'line',
    data:{
      labels: D.map(d => d.date),
      datasets:[
        { label:'Brent', data:D.map(d=>d.brent), borderColor:V.v3, backgroundColor:'transparent',
          borderWidth:2.5, pointRadius:2, pointHoverRadius:5, tension:0.4 },
        { label:'WTI',   data:D.map(d=>d.wti),   borderColor:V.v5, backgroundColor:'transparent',
          borderWidth:2,   pointRadius:1, pointHoverRadius:4, tension:0.4 },
        { label:'Oman/GME', data:D.map(d=>d.oman), borderColor:V.v9, backgroundColor:V.v9+'12',
          fill:true, borderWidth:3, borderDash:[6,3], pointRadius:2, pointHoverRadius:5, tension:0.4 }
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        tooltip:{ ...TIP, callbacks:{ label:c=>` ${c.dataset.label}: $${c.parsed.y.toFixed(2)}/bbl` }},
        legend:{ labels:{ color:'#6B6B6B', boxWidth:22, padding:16 }}
      },
      scales:{
        x: mkScale({ ticks:{ color:'#6B6B6B', maxRotation:50, font:{ size:9 }}}),
        y: mkScale({ min:60, max:180, title:{ display:true, text:'USD/bbl', color:'#6B6B6B', font:{ size:10 }}})
      }
    }
  });
}

/* ── 2. Sandbox Oil Chart ── */
function initSandboxOilChart() {
  const ctx = document.getElementById('chart-sandbox-oil');
  if (!ctx) return;
  const D = crisisData.oilPrices;
  mkChart(ctx, {
    type:'line',
    data:{
      labels: D.map(d => d.date),
      datasets:[
        { label:'Brent', data:D.map(d=>d.brent), borderColor:V.v3, borderWidth:2, pointRadius:0, tension:0.4, backgroundColor:'transparent' },
        { label:'WTI',   data:D.map(d=>d.wti),   borderColor:V.v5, borderWidth:1.5, pointRadius:0, tension:0.4, backgroundColor:'transparent' },
        { label:'Oman',  data:D.map(d=>d.oman),  borderColor:V.v9, borderWidth:2.5, pointRadius:0, tension:0.4, backgroundColor:V.v9+'10', fill:true }
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        tooltip:{ ...TIP, callbacks:{ label:c=>` ${c.dataset.label}: $${c.parsed.y.toFixed(2)}` }},
        legend:{ labels:{ color:'#6B6B6B', boxWidth:16, font:{ size:9 }}}
      },
      scales:{
        x: mkScale({ ticks:{ color:'#6B6B6B', maxRotation:45, font:{ size:8 }}}),
        y: mkScale({ min:60, max:180 })
      }
    }
  });
}

/* ── 3. Hormuz Daily Transit Bar ── */
function initHormuzBar() {
  const ctx = document.getElementById('chart-hormuz-bar');
  if (!ctx) return;
  const D = crisisData.hormuzDailyBar;
  const COLOR = { baseline:V.v3, permitted:V.v5, restricted:V.v7, zero:V.v0 };
  mkChart(ctx, {
    type:'bar',
    data:{
      labels: D.map(d => d.label),
      datasets:[{
        label:'Tanker transits/day',
        data:  D.map(d => d.transits),
        backgroundColor: D.map(d => (COLOR[d.type] || V.v3) + 'dd'),
        borderColor:     D.map(d => COLOR[d.type] || V.v3),
        borderWidth:1, borderRadius:2, borderSkipped:false
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        tooltip:{ ...TIP, callbacks:{
          title: c => `${D[c[0].dataIndex].date} (${D[c[0].dataIndex].type})`,
          label: c => ` ${c.parsed.y} transits/day`,
          afterLabel: c => `\n${D[c[0].dataIndex].note}`,
          footer: c => `Source: ${D[c[0].dataIndex].source}`
        }},
        legend:{ display:false },
        annotation:{
          annotations:{
            baseline:{
              type:'line', yMin:94, yMax:94,
              borderColor:'rgba(26,26,26,0.2)', borderWidth:1.5,
              borderDash:[5,4],
              label:{ display:true, content:'IMF PortWatch baseline ~94/day',
                color:'#6B6B6B', font:{ family:"'Work Sans', sans-serif", size:9 },
                position:'end', backgroundColor:'transparent' }
            },
            eiaBaseline:{
              type:'line', yMin:100, yMax:100,
              borderColor:'rgba(26,26,26,0.1)', borderWidth:1,
              borderDash:[3,6],
              label:{ display:true, content:"EIA/Lloyd's ~100/day",
                color:'#2B2B2B', font:{ family:"'Work Sans', sans-serif", size:8 },
                position:'start', backgroundColor:'transparent' }
            }
          }
        }
      },
      scales:{
        x: mkScale({ ticks:{ color:'#6B6B6B', font:{ size:9 }}}),
        y: mkScale({ min:0, max:110,
          title:{ display:true, text:'Transits/day', color:'#6B6B6B', font:{ size:10 }},
          grid:{ color:'#EEEBE4' }
        })
      }
    }
  });
}

/* ── 4. FX Reserves ── */
function initFXReserves() {
  const ctx = document.getElementById('chart-fx-reserves');
  if (!ctx) return;
  const D = crisisData.fxReserves;
  const labels = D.map(d => d.date.replace(', 2026','').replace(', 2025',''));
  mkChart(ctx, {
    type:'line',
    data:{
      labels,
      datasets:[{
        label:'FX Reserves (USD Bn)',
        data: D.map(d => d.value),
        borderColor:V.v2, backgroundColor:V.v2+'28',
        fill:true, borderWidth:2.5, pointRadius:4, pointHoverRadius:7, tension:0.3
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        tooltip:{ ...TIP, callbacks:{
          label:c => ` $${c.parsed.y.toFixed(1)}B`,
          footer:c => D[c[0].dataIndex]?.note || ''
        }},
        legend:{ display:false }
      },
      scales:{
        x: mkScale({ ticks:{ maxRotation:45, font:{ size:9 }}}),
        y: mkScale({ min:690, max:735,
          title:{ display:true, text:'USD Billion', color:'#6B6B6B', font:{ size:10 }}
        })
      }
    }
  });
}

/* ── 5. FX Rate (USD/INR) ── */
function initFXRate() {
  const ctx = document.getElementById('chart-fx-rate');
  if (!ctx) return;
  const D = crisisData.fxRates;
  mkChart(ctx, {
    type:'line',
    data:{
      labels: D.map(d => d.date),
      datasets:[{
        label:'USD/INR (₹ per $1)',
        data:  D.map(d => d.usdinr),
        borderColor:V.v8, backgroundColor:V.v8+'18',
        fill:true, borderWidth:2.5, pointRadius:4, tension:0.3
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        tooltip:{ ...TIP, callbacks:{ label:c => ` ₹${c.parsed.y.toFixed(2)} per $1` }},
        legend:{ display:false },
        annotation:{
          annotations:{
            peak:{
              type:'line', yMin:96.844, yMax:96.844,
              borderColor: V.v9 + '88', borderWidth:1.5, borderDash:[5,4],
              label:{ display:true, content:'₹96.844 peak (May 20, CONFIRMED)',
                color: V.v9, font:{ family:"'Work Sans', sans-serif", size:9 },
                position:'end', backgroundColor:'rgba(0,0,0,0.5)' }
            }
          }
        }
      },
      scales:{
        x: mkScale({ ticks:{ maxRotation:45, font:{ size:9 }}}),
        y: mkScale({ min:85, max:98,
          title:{ display:true, text:'₹ per $1', color:'#6B6B6B', font:{ size:10 }}
        })
      }
    }
  });
}

/* ── 6. CAD Sensitivity Bar Chart ── */
function initCAD() {
  const ctx = document.getElementById('chart-cad');
  if (!ctx) return;
  const D = crisisData.cadScenarios;
  mkChart(ctx, {
    type:'bar',
    data:{
      labels: D.map(d => d.label.split('\n')[0]),   /* first line only for axis */
      datasets:[{
        label:'Current Account Deficit (% of GDP)',
        data:  D.map(d => d.cad),
        backgroundColor: D.map(d => d.color + 'cc'),
        borderColor:     D.map(d => d.color),
        borderWidth:1.5, borderRadius:4, borderSkipped:false
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        tooltip:{ ...TIP, callbacks:{
          title:  c => D[c[0].dataIndex].label.replace('\n',' '),
          label:  c => ` CAD: ${c.parsed.y.toFixed(1)}% of GDP`,
          footer: c => `Oil assumption: $${D[c[0].dataIndex].oil}/bbl\nGDP: ${D[c[0].dataIndex].gdp}%\n${D[c[0].dataIndex].note||''}`
        }},
        legend:{ display:false }
      },
      scales:{
        x: mkScale({ ticks:{ color:'#6B6B6B', font:{ size:9 }, maxRotation:0 }}),
        y: mkScale({ min:-3.2, max:0.3,
          title:{ display:true, text:'% of GDP', color:'#6B6B6B', font:{ size:10 }}
        })
      }
    }
  });
}

/* ── 7. War Risk Premium ── */
function initWarRisk() {
  const ctx = document.getElementById('chart-war-risk');
  if (!ctx) return;
  const D = crisisData.warRiskPremium;
  mkChart(ctx, {
    type:'line',
    data:{
      labels: D.map(d => d.date),
      datasets:[{
        label:'War Risk Premium (% vessel value/voyage)',
        data:  D.map(d => d.pct),
        borderColor:V.v9, backgroundColor:V.v9+'1a',
        fill:true, borderWidth:2.5, pointRadius:5, pointHoverRadius:8, tension:0.25
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        tooltip:{ ...TIP, callbacks:{
          label:  c => ` ${c.parsed.y.toFixed(2)}% AWRP of H&M value / 7-day`,
          footer: c => D[c[0].dataIndex]?.note || ''
        }},
        legend:{ display:false },
        annotation:{
          annotations:{
            awrpPeak:{
              type:'line', yMin:2.5, yMax:2.5,
              borderColor: V.v9 + '99', borderWidth:1.5, borderDash:[5,4],
              label:{ display:true, content:'2.5% AWRP peak (early Mar — S&P Global CONFIRMED)',
                color: V.v9, font:{ family:"'Work Sans', sans-serif", size:9 },
                position:'end', backgroundColor:'rgba(0,0,0,0.6)' }
            },
            baseline:{
              type:'line', yMin:0.125, yMax:0.125,
              borderColor:'rgba(26,26,26,0.15)', borderWidth:1, borderDash:[3,5],
              label:{ display:true, content:'Pre-conflict baseline 0.10–0.15%',
                color:'#6B6B6B', font:{ family:"'Work Sans', sans-serif", size:8 },
                position:'start', backgroundColor:'transparent' }
            }
          }
        }
      },
      scales:{
        x: mkScale({ ticks:{ maxRotation:40, font:{ size:9 }}}),
        y: mkScale({ min:0, max:3.0,
          title:{ display:true, text:'AWRP % of H&M value / 7 days', color:'#6B6B6B', font:{ size:10 }}
        })
      }
    }
  });
}

/* ── 8. Mariners Stranded — Full Section ── */
function initMariners() {
  const ctx = document.getElementById('chart-mariners');
  if (!ctx) return;
  const D = crisisData.marinersStranded;
  mkChart(ctx, {
    type:'line',
    data:{
      labels: D.map(d => d.date),
      datasets:[
        { label:'Mariners Stranded', data:D.map(d=>d.mariners),
          borderColor:V.v9, backgroundColor:V.v9+'1e', spanGaps:true,
          fill:true, borderWidth:2.5, pointRadius:5, tension:0.3, yAxisID:'y' },
        { label:'Vessels Stranded', data:D.map(d => d.ships ?? null),
          borderColor:V.v4, backgroundColor:'transparent', spanGaps:true,
          borderDash:[5,3], borderWidth:2, pointRadius:4, tension:0.3, yAxisID:'y1' }
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        tooltip:{ ...TIP },
        legend:{ labels:{ color:'#6B6B6B', boxWidth:20 }},
        annotation:{
          annotations:{
            imoAlert:{ type:'line', yMin:20000, yMax:20000, borderColor:V.v9+'55',
              borderWidth:1.5, borderDash:[5,4],
              label:{ display:true, content:'IMO declared humanitarian crisis (Apr 21)',
                color:V.v9, font:{ family:"'Work Sans', sans-serif", size:9 },
                position:'start', backgroundColor:'rgba(0,0,0,0.5)' }},
            genCaine:{ type:'line', yMin:22500, yMax:22500, borderColor:V.v8+'55',
              borderWidth:1.5, borderDash:[3,5],
              label:{ display:true, content:'Gen. Caine confirmed 22,500 (May 6)',
                color:V.v8, font:{ family:"'Work Sans', sans-serif", size:9 },
                position:'end', backgroundColor:'rgba(0,0,0,0.5)' }}
          }
        }
      },
      scales:{
        x:  mkScale(),
        y:  mkScale({ min:0, max:25000, position:'left',
          title:{ display:true, text:'Mariners stranded', color:'#6B6B6B', font:{ size:10 }}}),
        y1: mkScale({ min:0, max:2200,  position:'right',
          title:{ display:true, text:'Vessels stranded', color:'#6B6B6B', font:{ size:10 }},
          grid:{ drawOnChartArea:false }})
      }
    }
  });
}

/* ── 8b. Mariners — Compact Sandbox ── */
function initMarinersSb() {
  const ctx = document.getElementById('chart-mariners-sb');
  if (!ctx) return;
  const D = crisisData.marinersStranded;
  mkChart(ctx, {
    type:'line',
    data:{
      labels: D.map(d => d.date),
      datasets:[
        { label:'Mariners', data:D.map(d=>d.mariners), borderColor:V.v9, backgroundColor:V.v9+'15', fill:true, borderWidth:2, pointRadius:0, tension:0.3, spanGaps:true },
        { label:'Vessels',  data:D.map(d => d.ships ?? null), borderColor:V.v4, backgroundColor:'transparent', borderDash:[4,3], borderWidth:1.5, pointRadius:0, tension:0.3, yAxisID:'y1', spanGaps:true }
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        tooltip:{ ...TIP },
        legend:{ labels:{ color:'#6B6B6B', boxWidth:12, font:{ size:9 }}}
      },
      scales:{
        x:  mkScale({ ticks:{ font:{ size:8 }, maxRotation:30 }}),
        y:  mkScale({ min:0, max:25000 }),
        y1: mkScale({ min:0, max:2200, position:'right', grid:{ drawOnChartArea:false }})
      }
    }
  });
}

/* ── 9. CAD Widening — Horizontal Stacked Bar ── */
function initCADWidening() {
  const ctx = document.getElementById('chart-cad-widening');
  if (!ctx) return;
  const D = [...crisisData.embiExpanded].sort((a, b) => a.totalCAD - b.totalCAD);
  mkChart(ctx, {
    type:'bar',
    data:{
      labels: D.map(d => d.country),
      datasets:[
        { label:'Pre-conflict CAD (% GDP)',
          data:  D.map(d => d.preCAD),
          backgroundColor: V.v2+'bb', borderWidth:0, stack:'cad', borderRadius:2 },
        { label:'Additional oil shock',
          data:  D.map(d => Math.min(d.oilShock, 0)),
          backgroundColor: V.v8+'bb', borderWidth:0, stack:'cad', borderRadius:2 }
      ]
    },
    options:{
      indexAxis:'y',
      responsive:true, maintainAspectRatio:false,
      plugins:{
        tooltip:{ ...TIP, callbacks:{
          label:  c => ` ${c.dataset.label}: ${c.parsed.x.toFixed(1)}% of GDP`,
          footer: c => `Rating: ${D[c[0].dataIndex].rating} | Source: ${D[c[0].dataIndex].source}`
        }},
        legend:{ labels:{ color:'#6B6B6B', boxWidth:14 }}
      },
      scales:{
        x: mkScale({ min:-8, max:0.5,
          title:{ display:true, text:'% of GDP', color:'#6B6B6B', font:{ size:10 }}}),
        y: mkScale({ ticks:{ font:{ size:10 }}})
      }
    }
  });
}

/* ── 10. EMBI Spreads — Grouped Bar ── */
function initEMBI() {
  const ctx = document.getElementById('chart-embi');
  if (!ctx) return;
  const D = [...crisisData.embiExpanded].sort((a, b) => b.embi_post - a.embi_post);
  mkChart(ctx, {
    type:'bar',
    data:{
      labels: D.map(d => d.country),
      datasets:[
        { label:'Pre-conflict spread',
          data:  D.map(d => d.embi_pre),
          backgroundColor: V.v3+'bb', borderRadius:2, borderSkipped:false },
        { label:'Post-shock estimate',
          data:  D.map(d => d.embi_post),
          backgroundColor: V.v9+'bb', borderRadius:2, borderSkipped:false }
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        tooltip:{ ...TIP, callbacks:{
          label:  c => ` ${c.dataset.label}: ${c.parsed.y} bps`,
          footer: c => `Rating: ${D[c[0].dataIndex].rating}`
        }},
        legend:{ labels:{ color:'#6B6B6B', boxWidth:14 }}
      },
      scales:{
        x: mkScale({ ticks:{ maxRotation:40, font:{ size:9 }}}),
        y: mkScale({ min:0,
          title:{ display:true, text:'Basis points (bps)', color:'#6B6B6B', font:{ size:10 }}
        })
      }
    }
  });
}

/* ── 11. State Remittances Bar ── */
function initStateBars() {
  const ctx = document.getElementById('chart-state-bars');
  if (!ctx) return;
  const D = crisisData.remittancesStateShare;
  mkChart(ctx, {
    type:'bar',
    data:{
      labels: D.map(d => d.state),
      datasets:[{
        label:'% of total India remittances',
        data:  D.map(d => d.pct),
        backgroundColor: D.map(d => d.color + 'cc'),
        borderColor:     D.map(d => d.color),
        borderWidth:1.5, borderRadius:3, borderSkipped:false
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        tooltip:{ ...TIP, callbacks:{
          label:  c => ` ${c.parsed.y.toFixed(1)}% of total`,
          footer: c => `USD $${D[c[0].dataIndex].usd_bn?.toFixed(1) || '?'}B${D[c[0].dataIndex].note ? '\n'+D[c[0].dataIndex].note : ''}`
        }},
        legend:{ display:false }
      },
      scales:{
        x: mkScale({ ticks:{ maxRotation:45, font:{ size:9 }}}),
        y: mkScale({ min:0, max:24,
          title:{ display:true, text:'% of total', color:'#6B6B6B', font:{ size:10 }}
        })
      }
    }
  });
}

/* ── 12. Remittances Trend Line ── */
function initRemittancesTrend() {
  const ctx = document.getElementById('chart-rem-trend');
  if (!ctx) return;
  const D = crisisData.remittancesTrend;
  mkChart(ctx, {
    type:'line',
    data:{
      labels: D.map(d => d.fy),
      datasets:[
        { label:'Total Remittances (USD Bn)',
          data:  D.map(d => d.total),
          borderColor:V.v5, backgroundColor:V.v5+'22',
          fill:true, borderWidth:2.5, pointRadius:5, tension:0.3 },
        { label:'GCC Share (USD Bn)',
          data:  D.map(d => d.gcc),
          borderColor:V.v9, backgroundColor:'transparent',
          borderDash:[5,3], borderWidth:2, pointRadius:5, tension:0.3 }
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        tooltip:{ ...TIP, callbacks:{
          label:  c => ` ${c.dataset.label}: $${c.parsed.y.toFixed(1)}B`,
          footer: c => D[c[0].dataIndex]?.note || ''
        }},
        legend:{ labels:{ color:'#6B6B6B', boxWidth:20 }}
      },
      scales:{
        x: mkScale({ ticks:{ maxRotation:40, font:{ size:9 }}}),
        y: mkScale({ min:0, max:145,
          title:{ display:true, text:'USD Billion', color:'#6B6B6B', font:{ size:10 }}
        })
      }
    }
  });
}

/* ═══════════════════════════════════════════════════════════════
   11. GEOPOLITICAL COST TABLE
═══════════════════════════════════════════════════════════════ */
const NET_CLS = {
  'Catastrophic':'net-catastrophic', 'Severe':'net-severe',
  'Tactical gain':'net-mixed',       'Net gain':'net-gain',
  'High exposure':'net-exposure',    'Mixed':'net-mixed',
  'Severe economic':'net-severe',    'Critical':'net-catastrophic',
  'Moderate':'net-moderate'
};

function buildGeoTable() {
  const tbody = document.getElementById('geo-table-body');
  if (!tbody) return;
  (crisisData.geopoliticalCosts || []).forEach(row => {
    const cls = NET_CLS[row.net] || 'net-moderate';
    const tr  = document.createElement('tr');
    tr.innerHTML =
      `<td class="country-cell">${row.country}</td>` +
      `<td><span class="role-badge">${row.role}</span></td>` +
      `<td style="max-width:420px;font-size:12px;color:#6B6B6B;line-height:1.5">${row.cost}</td>` +
      `<td><span class="net-badge ${cls}">${row.net}</span></td>`;
    tbody.appendChild(tr);
  });
}

/* ═══════════════════════════════════════════════════════════════
   12. RESIZE — RE-RENDER SANKEYS ON WINDOW RESIZE
═══════════════════════════════════════════════════════════════ */
let _rsTimer;
window.addEventListener('resize', () => {
  clearTimeout(_rsTimer);
  _rsTimer = setTimeout(() => {
    renderSankeyIndia(currentSankeyMode);
    renderSankeyGlobal();
    if (scrollMap)  scrollMap.invalidateSize();
    if (sandboxMap) sandboxMap.invalidateSize();
  }, 220);
}, { passive:true });

/* ═══════════════════════════════════════════════════════════════
   MAIN INIT
═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* Core UI */
  setNavHeightVar();
  initProgressBar();
  buildPhaseLegend();
  initStickyLegend();
  initSectionNav();

  /* Keep sticky offsets + map sizing correct across resize/orientation */
  let rT;
  window.addEventListener('resize', () => {
    clearTimeout(rT);
    rT = setTimeout(() => {
      setNavHeightVar();
      scrollMap?.invalidateSize();
      sandboxMap?.invalidateSize();
    }, 150);
  }, { passive: true });

  /* Maps */
  initScrollMap();
  initSandboxMap();

  /* Scrollytelling — build steps, then observe after layout */
  buildScrollSteps();
  requestAnimationFrame(() => requestAnimationFrame(initScrollytelling));

  /* Slider */
  initSlider();

  /* Sankey toggle buttons */
  document.getElementById('sankey-india-normal-btn')
    ?.addEventListener('click', () => renderSankeyIndia('normal'));
  document.getElementById('sankey-india-crisis-btn')
    ?.addEventListener('click', () => renderSankeyIndia('crisis'));

  /* Sankeys — small delay so container widths are computed */
  setTimeout(() => {
    renderSankeyIndia('normal');
    renderSankeyGlobal();
  }, 100);

  /* All Chart.js charts */
  initOilChart();
  initSandboxOilChart();
  initHormuzBar();
  initFXReserves();
  initFXRate();
  initCAD();
  initWarRisk();
  initMariners();
  initMarinersSb();
  initCADWidening();
  initEMBI();
  initStateBars();
  initRemittancesTrend();

  /* Table */
  buildGeoTable();

  /* Intentionally do NOT prime the first scroll step. The map overlay shows a
     "Scroll to begin the timeline →" call-to-action until the reader engages;
     priming half-way (is-active + marker, but not the overlay text) left the
     first step highlighted while the overlay still read "scroll to begin",
     which looked like a desync. The observer and section-nav activate the real
     first step the moment it scrolls into the reading zone. */

  /* Theme toggle — runs last so charts + maps exist to re-theme */
  initThemeToggle();

});
