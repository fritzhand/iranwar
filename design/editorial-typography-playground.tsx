import React, { useState, useEffect } from 'react';

// Define the 8 high-end editorial pairings
const FONT_PAIRINGS = [
  {
    id: "01",
    headingFont: "DM Serif Display",
    bodyFont: "DM Sans",
    vibe: "High-Contrast Modern Editorial",
    personality: "Chic, clean, and highly structured. Excellent for digital editorial giants and style lookbooks.",
    tag: "Contemporary",
    headingText: "The Art of Living Intentionally in a Chaotic World",
    bodyText: "In a world driven by constant acceleration and persistent digital noise, slowing down is no longer just a luxury. It has become a radical act of self-preservation, creative renewal, and profound personal clarity.",
    cssHeading: "font-family: 'DM Serif Display', serif;",
    cssBody: "font-family: 'DM Sans', sans-serif;",
    googleLink: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,600;1,300&family=DM+Serif+Display&display=swap"
  },
  {
    id: "02",
    headingFont: "Italiana",
    bodyFont: "Plus Jakarta Sans",
    vibe: "Minimalist Luxury Fashion",
    personality: "Ultra-thin, elegant, and whisper-quiet luxury. Best suited for haute couture, gallery exhibits, and design studios.",
    tag: "Luxury",
    headingText: "CURATED SHAPES: THE REBIRTH OF SILENT DESIGN",
    bodyText: "Architectural symmetry meets organic comfort. In this issue, we sit down with structural minimalists who are reshaping the physical footprints of our living spaces using raw, unrefined elements.",
    cssHeading: "font-family: 'Italiana', serif; text-transform: uppercase; letter-spacing: 0.05em;",
    cssBody: "font-family: 'Plus Jakarta Sans', sans-serif;",
    googleLink: "https://fonts.googleapis.com/css2?family=Italiana&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap"
  },
  {
    id: "03",
    headingFont: "Newsreader",
    bodyFont: "Mulish",
    vibe: "Contemporary Literary Journal",
    personality: "Warm, highly legible, and beautifully intellectual. Perfect for essay series, culture blogs, and newsletters.",
    tag: "Literary",
    headingText: "Fragments of the Great Silent Transition",
    bodyText: "A collection of short prose, investigative journalism, and artistic records tracking the quiet shifts in urban ecology. We explore what happens when city neighborhoods reclaim their forgotten natural edges.",
    cssHeading: "font-family: 'Newsreader', serif; font-style: italic;",
    cssBody: "font-family: 'Mulish', sans-serif;",
    googleLink: "https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&display=swap"
  },
  {
    id: "04",
    headingFont: "Cardo",
    bodyFont: "Josefin Sans",
    vibe: "Vintage Academic meets Geometric",
    personality: "Deeply historical, scholarly, and uniquely paired with clean, geometric modern lines. Beautiful for luxury heritage brands.",
    tag: "Heritage",
    headingText: "ARCHIVAL SELECTIONS",
    bodyText: "Unearthing century-old typographic traditions and re-contextualizing them into responsive web experiences. We build a delicate bridge between ink on heavy cotton paper and pixels on a glowing retina display.",
    cssHeading: "font-family: 'Cardo', serif;",
    cssBody: "font-family: 'Josefin Sans', sans-serif;",
    googleLink: "https://fonts.googleapis.com/css2?family=Cardo:ital,wght@0,400;0,700;1,400&family=Josefin+Sans:wght@300;400;500;600&display=swap"
  },
  {
    id: "05",
    headingFont: "Gloock",
    bodyFont: "Schibsted Grotesk",
    vibe: "Avant-Garde Bold Editorial",
    personality: "Heavy, high-fashion display stencil style meets structural, sturdy Norwegian utility sans. Unapologetically confident.",
    tag: "Avant-Garde",
    headingText: "SHATTERING GLASS CEILINGS IN METRIC SPACE",
    bodyText: "We challenge traditional typography layouts using highly extreme font weights, dramatic vertical margins, and a heavy, brutalist approach to visual hierarchies in dynamic web layouts.",
    cssHeading: "font-family: 'Gloock', serif;",
    cssBody: "font-family: 'Schibsted Grotesk', sans-serif;",
    googleLink: "https://fonts.googleapis.com/css2?family=Gloock&family=Schibsted+Grotesk:wght@400;500;600&display=swap"
  },
  {
    id: "06",
    headingFont: "Crimson Pro",
    bodyFont: "Work Sans",
    vibe: "Premium Longform Journalism",
    personality: "Gravely serious, authoritative, and clean. Designed for sustained reading and immersive journalism.",
    tag: "Journalism",
    headingText: "The Global Shift Toward Local Autonomy",
    bodyText: "As macroeconomic systems undergo unprecedented structural stresses, decentralization is transforming community planning. Explore how local food, power, and information hubs are quietly taking control.",
    cssHeading: "font-family: 'Crimson Pro', serif; font-weight: 600;",
    cssBody: "font-family: 'Work Sans', sans-serif;",
    googleLink: "https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Work+Sans:wght@300;400;500&display=swap"
  },
  {
    id: "07",
    headingFont: "Alice",
    bodyFont: "Urbanist",
    vibe: "Whimsical & Boutique",
    personality: "Elegant with curved, playful serif endings matched with a highly stylized, futuristic geometric sans.",
    tag: "Boutique",
    headingText: "Curious Botanicals & Enchanted Apothecary",
    bodyText: "Step inside a curated greenhouse filled with historical herbal remedies, small-batch cold presses, and the magical design narratives woven behind hand-crafted, artisanal packaging labels.",
    cssHeading: "font-family: 'Alice', serif;",
    cssBody: "font-family: 'Urbanist', sans-serif;",
    googleLink: "https://fonts.googleapis.com/css2?family=Alice&family=Urbanist:wght@300;400;500;600&display=swap"
  },
  {
    id: "08",
    headingFont: "Instrument Serif",
    bodyFont: "Tenor Sans",
    vibe: "Sleek Lifestyle & Interior Design",
    personality: "Beautifully compressed, organic serif curves alongside an airy, spacious sans-serif meant for luxury titles.",
    tag: "Sleek",
    headingText: "Designing Sanctuary: Where Quiet Meets Comfort",
    bodyText: "How we configure our physical spaces is a direct mirror of our mental horizons. Explore our latest showcase of residential sanctuaries meticulously constructed using raw woods, textured plasters, and empty space.",
    cssHeading: "font-family: 'Instrument Serif', serif; font-style: italic;",
    cssBody: "font-family: 'Tenor Sans', sans-serif;",
    googleLink: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Tenor+Sans&display=swap"
  }
];

export default function App() {
  const [activePairId, setActivePairId] = useState("01");
  const [activeViewMode, setActiveViewMode] = useState("compare"); // "compare" | "focus" | "sandbox"
  const [theme, setTheme] = useState("light"); // "light" | "dark" | "sepia"
  
  // Custom sandbox values
  const [customHeading, setCustomHeading] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [fontSizeHeading, setFontSizeHeading] = useState(48); // px
  const [fontSizeBody, setFontSizeBody] = useState(16); // px

  const [copiedText, setCopiedText] = useState("");

  // Dynamically load all 8 pairs from Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = "https://fonts.googleapis.com/css2?family=Alice&family=Cardo:ital,wght@0,400;0,700;1,400&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,600;1,300&family=DM+Serif+Display&family=Gloock&family=Instrument+Serif:ital@0;1&family=Italiana&family=Josefin+Sans:wght@300;400;500;600&family=Mulish:ital,wght@0,300;0,400;0,500;1,300&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Schibsted+Grotesk:ital,wght@0,400;0,500;0,600;1,400&family=Tenor+Sans&family=Urbanist:ital,wght@0,300;0,400;0,500;1,300&family=Work+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const activePair = FONT_PAIRINGS.find(p => p.id === activePairId) || FONT_PAIRINGS[0];

  const handleCopyCode = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(""), 2500);
  };

  // Set theme background & text styles
  const getThemeClass = () => {
    switch (theme) {
      case "dark":
        return "bg-[#111110] text-[#f2efe9] border-[#2d2c29]";
      case "sepia":
        return "bg-[#f4ebd0] text-[#3e2723] border-[#decba4]";
      default: // light
        return "bg-[#faf9f5] text-[#1c1b19] border-[#e8e5dc]";
    }
  };

  const getCardBg = () => {
    switch (theme) {
      case "dark": return "bg-[#181816] hover:bg-[#1f1f1d] border-[#2d2c29]";
      case "sepia": return "bg-[#efe3c3] hover:bg-[#e6d9b5] border-[#dfd1aa]";
      default: return "bg-[#ffffff] hover:bg-[#f6f5f0] border-[#eceae1]";
    }
  };

  const getCodeBlockBg = () => {
    switch (theme) {
      case "dark": return "bg-[#21211f] text-[#f2efe9]";
      case "sepia": return "bg-[#e5d8b7] text-[#3e2723]";
      default: return "bg-[#f5f3ec] text-[#1c1b19]";
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getThemeClass()} flex flex-col font-sans`}>
      
      {/* Top Premium Navbar */}
      <header className={`border-b px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4`}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#8a7a5f] to-[#d4af37] flex items-center justify-center font-serif italic text-white font-bold">f</div>
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Curation Series</span>
            <h1 className="text-lg font-serif tracking-tight font-semibold">Editorial Typographic Pairings</h1>
          </div>
        </div>

        {/* View Mode Selectors */}
        <div className="flex bg-neutral-200 dark:bg-neutral-800 p-1 rounded-lg text-xs font-medium">
          <button 
            onClick={() => setActiveViewMode("compare")}
            className={`px-4 py-1.5 rounded-md transition-all ${activeViewMode === "compare" ? "bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white" : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"}`}
          >
            All Pairings Grid
          </button>
          <button 
            onClick={() => setActiveViewMode("focus")}
            className={`px-4 py-1.5 rounded-md transition-all ${activeViewMode === "focus" ? "bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white" : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"}`}
          >
            Focus Mockups
          </button>
          <button 
            onClick={() => setActiveViewMode("sandbox")}
            className={`px-4 py-1.5 rounded-md transition-all ${activeViewMode === "sandbox" ? "bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white" : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"}`}
          >
            Interactive Sandbox
          </button>
        </div>

        {/* Theme Toggles */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-neutral-400">Atmosphere:</span>
          <div className="flex gap-1.5">
            <button 
              onClick={() => setTheme("light")} 
              title="Light theme"
              className={`w-6 h-6 rounded-full border border-neutral-300 bg-[#faf9f5] ${theme === 'light' ? 'ring-2 ring-[#a38f6d]' : ''}`} 
            />
            <button 
              onClick={() => setTheme("sepia")} 
              title="Sepia book theme"
              className={`w-6 h-6 rounded-full border border-[#decba4] bg-[#f4ebd0] ${theme === 'sepia' ? 'ring-2 ring-[#8a6e3d]' : ''}`} 
            />
            <button 
              onClick={() => setTheme("dark")} 
              title="Deep obsidian theme"
              className={`w-6 h-6 rounded-full border border-[#2d2c29] bg-[#111110] ${theme === 'dark' ? 'ring-2 ring-amber-400' : ''}`} 
            />
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Left Interactive Control Drawer (Always active to control state) */}
        <aside className="w-full lg:w-[350px] border-r border-inherit p-6 flex flex-col gap-6 shrink-0 bg-opacity-40 bg-neutral-50 dark:bg-neutral-900">
          <div>
            <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-neutral-400 mb-3">Active Pair</h3>
            <div className="grid grid-cols-4 gap-1.5">
              {FONT_PAIRINGS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePairId(p.id);
                    if (activeViewMode === "compare") setActiveViewMode("focus");
                  }}
                  className={`py-2 text-sm font-mono rounded border transition-all ${
                    activePairId === p.id 
                      ? "bg-[#1c1b19] dark:bg-[#fdfcf7] text-white dark:text-black border-transparent font-bold" 
                      : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-500"
                  }`}
                >
                  {p.id}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Specs for Selected Font Pair */}
          <div className="p-4 rounded-lg border border-inherit bg-neutral-100 dark:bg-neutral-800 bg-opacity-50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono uppercase bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                {activePair.tag}
              </span>
              <span className="text-xs font-mono text-neutral-400">Specs</span>
            </div>
            
            <h4 className="text-lg font-serif italic mb-1 text-amber-900 dark:text-amber-400 leading-tight">
              {activePair.vibe}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
              {activePair.personality}
            </p>

            <div className="space-y-3 pt-3 border-t border-dashed border-neutral-300 dark:border-neutral-700">
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-400 block">Heading Font</span>
                <span className="text-sm font-semibold tracking-wide" style={{ fontFamily: activePair.headingFont }}>
                  {activePair.headingFont}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-400 block">Body Text Font</span>
                <span className="text-sm font-semibold tracking-wide" style={{ fontFamily: activePair.bodyFont }}>
                  {activePair.bodyFont}
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Code Exporter */}
          <div className="flex-1 flex flex-col justify-end">
            <div className="pt-4 border-t border-inherit">
              <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-neutral-400 mb-3">Integration Code</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono text-neutral-400">1. Google Fonts Import</span>
                    <button 
                      onClick={() => handleCopyCode(`<link href="${activePair.googleLink}" rel="stylesheet">`, 'html')}
                      className="text-[10px] font-mono text-amber-700 dark:text-amber-400 hover:underline"
                    >
                      {copiedText === 'html' ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <pre className={`text-[11px] p-2 rounded overflow-x-auto font-mono ${getCodeBlockBg()}`}>
                    {`<link href="${activePair.headingFont.slice(0, 5)}..." rel="stylesheet">`}
                  </pre>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono text-neutral-400">2. CSS Rules</span>
                    <button 
                      onClick={() => handleCopyCode(`${activePair.cssHeading}\n${activePair.cssBody}`, 'css')}
                      className="text-[10px] font-mono text-amber-700 dark:text-amber-400 hover:underline"
                    >
                      {copiedText === 'css' ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <pre className={`text-[11px] p-2 rounded overflow-x-auto font-mono ${getCodeBlockBg()} leading-snug`}>
                    {activePair.cssHeading}
                    {"\n"}
                    {activePair.cssBody}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Preview Screen */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-[calc(100vh-80px)]">
          
          {/* 1. COMPARE GRID VIEW */}
          {activeViewMode === "compare" && (
            <div>
              <div className="mb-8 max-w-xl">
                <h2 className="text-2xl font-serif mb-2">Google Font Combinations Gallery</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Browse each pairing laid out side-by-side using real magazine components. Click any card to select it, change themes, or enter deep customization mode.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {FONT_PAIRINGS.map((pair) => (
                  <div 
                    key={pair.id}
                    onClick={() => setActivePairId(pair.id)}
                    className={`p-6 rounded-xl border transition-all duration-200 cursor-pointer relative group flex flex-col justify-between ${
                      activePairId === pair.id 
                        ? 'ring-2 ring-[#a38f6d] shadow-lg border-transparent' 
                        : getCardBg()
                    }`}
                  >
                    <div>
                      {/* Card Header metadata */}
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-mono">
                            {pair.id}
                          </span>
                          <span className="text-xs font-mono uppercase text-neutral-400">{pair.tag}</span>
                        </div>
                        <span className="text-[10px] tracking-wider text-neutral-400 uppercase font-mono font-medium group-hover:text-amber-600 transition-colors">
                          {pair.vibe}
                        </span>
                      </div>

                      {/* Heading Element */}
                      <h3 
                        style={{ fontFamily: pair.headingFont }}
                        className="text-2xl md:text-3xl mb-4 leading-tight tracking-tight text-neutral-900 dark:text-neutral-50"
                      >
                        {customHeading || pair.headingText}
                      </h3>

                      {/* Body Element */}
                      <p 
                        style={{ fontFamily: pair.bodyFont }}
                        className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light"
                      >
                        {customBody || pair.bodyText}
                      </p>
                    </div>

                    {/* Card Footer typography tags */}
                    <div className="mt-8 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-[11px] font-mono text-neutral-400">
                      <div>H: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{pair.headingFont}</span></div>
                      <div>B: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{pair.bodyFont}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. FOCUS MOCKUPS VIEW */}
          {activeViewMode === "focus" && (
            <div className="max-w-4xl mx-auto space-y-16">
              
              {/* Introduction Banner */}
              <div className="border-b border-inherit pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono block mb-1">Interactive Focus Presentation</span>
                  <h2 className="text-3xl font-serif">Pairing {activePair.id}: {activePair.vibe}</h2>
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  Click other numbers on the left menu to instantly swap this layout's aesthetic.
                </div>
              </div>

              {/* Layout Mock 1: Luxury Editorial Editorial Header */}
              <section className="space-y-6">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 block uppercase">Layout Layout A: Modern Spread</span>
                
                <div className="border-t-2 border-b-2 border-inherit py-12 px-6 text-center">
                  <span className="text-xs tracking-widest uppercase font-mono text-neutral-400 mb-3 block">Volume XII / Issue IV</span>
                  
                  <h1 
                    style={{ fontFamily: activePair.headingFont }}
                    className="text-4xl md:text-6xl max-w-2xl mx-auto leading-tight mb-8"
                  >
                    {customHeading || activePair.headingText}
                  </h1>

                  <div className="h-px bg-neutral-300 dark:bg-neutral-800 w-24 mx-auto mb-8"></div>

                  <p 
                    style={{ fontFamily: activePair.bodyFont }}
                    className="text-base md:text-lg text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto leading-relaxed font-light"
                  >
                    {customBody || activePair.bodyText}
                  </p>
                </div>
              </section>

              {/* Layout Mock 2: Standard Post / Literary Magazine style */}
              <section className="space-y-6">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 block uppercase">Layout Layout B: Long-Form Essay Structure</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                  
                  {/* Left Metadata panel */}
                  <div className="space-y-4 border-b md:border-b-0 md:border-r border-inherit pb-6 md:pb-0 md:pr-6 text-xs font-mono text-neutral-400">
                    <div>
                      <span className="block text-neutral-500 uppercase font-bold text-[10px]">Published:</span>
                      <span>Oct 14, 2026</span>
                    </div>
                    <div>
                      <span className="block text-neutral-500 uppercase font-bold text-[10px]">Author:</span>
                      <span className="underline">Eleanor Vance</span>
                    </div>
                    <div>
                      <span className="block text-neutral-500 uppercase font-bold text-[10px]">Reading Time:</span>
                      <span>8 Min Read</span>
                    </div>
                    <div>
                      <span className="block text-neutral-500 uppercase font-bold text-[10px]">Vibe Rating:</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">{activePair.tag}</span>
                    </div>
                  </div>

                  {/* Core Main Content Body */}
                  <div className="md:col-span-2 space-y-6">
                    <h2 
                      style={{ fontFamily: activePair.headingFont }}
                      className="text-2xl md:text-3xl font-medium leading-snug"
                    >
                      {customHeading || activePair.headingText}
                    </h2>

                    <p 
                      style={{ fontFamily: activePair.bodyFont }}
                      className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light"
                    >
                      {customBody || activePair.bodyText}
                    </p>

                    <p 
                      style={{ fontFamily: activePair.bodyFont }}
                      className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light"
                    >
                      By designing with structural contrast, the layout captures the sensory beauty of printed materials. Every line height is calibrated to let space breathe. Feel free to use the interactive drawer code setup panel below or copy individual elements using custom inputs to perfectly fit your branding identity.
                    </p>
                  </div>

                </div>
              </section>

              {/* Layout Mock 3: Premium Modern Product Hero card */}
              <section className="space-y-6">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 block uppercase">Layout Layout C: Boutique Product Spotlight Card</span>
                
                <div className="bg-[#1c1b19] text-[#f2efe9] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="space-y-4 max-w-lg">
                    <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">Special Curated Edition</span>
                    <h2 
                      style={{ fontFamily: activePair.headingFont }}
                      className="text-3xl md:text-4xl text-white font-light leading-tight"
                    >
                      {customHeading || "Crafting Minimal Digital Legacies"}
                    </h2>
                    <p 
                      style={{ fontFamily: activePair.bodyFont }}
                      className="text-sm text-neutral-300 leading-relaxed font-light"
                    >
                      {customBody || "An exploration into timeless web design that completely bypasses aggressive modern UI trends. Invest in pure typography."}
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto">
                    <button className="px-6 py-3 bg-[#e6ded0] text-black font-semibold rounded-lg hover:bg-white transition-all text-xs uppercase tracking-widest">
                      Secure Access
                    </button>
                    <button className="px-6 py-3 border border-neutral-600 text-neutral-300 rounded-lg hover:text-white hover:border-white transition-all text-xs font-mono">
                      Learn Aesthetic Specs
                    </button>
                  </div>
                </div>
              </section>

            </div>
          )}

          {/* 3. INTERACTIVE SANDBOX VIEW */}
          {activeViewMode === "sandbox" && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="mb-6">
                <h2 className="text-2xl font-serif mb-1">Live Editorial Sandbox</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Write your own headlines and copy, adjust typography sizing instantly, and see exactly how it feels on both fonts of active pair <strong className="text-neutral-800 dark:text-white font-mono">[{activePair.id}]</strong>.
                </p>
              </div>

              {/* Editing Controls & Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl border border-inherit bg-neutral-100 dark:bg-neutral-800/40">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1">Headline Text</label>
                    <input 
                      type="text"
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-black dark:text-white"
                      placeholder={activePair.headingText}
                      value={customHeading}
                      onChange={(e) => setCustomHeading(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1">Headline Font Size ({fontSizeHeading}px)</label>
                    <input 
                      type="range" 
                      min="24" 
                      max="80" 
                      value={fontSizeHeading}
                      onChange={(e) => setFontSizeHeading(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1">Body / Paragraph Text</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-black dark:text-white"
                      placeholder={activePair.bodyText}
                      value={customBody}
                      onChange={(e) => setCustomBody(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1">Body Font Size ({fontSizeBody}px)</label>
                    <input 
                      type="range" 
                      min="12" 
                      max="24" 
                      value={fontSizeBody}
                      onChange={(e) => setFontSizeBody(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Sandbox Playground Result Display */}
              <div className="p-8 md:p-12 rounded-xl border border-inherit min-h-[300px] flex flex-col justify-center bg-white dark:bg-[#151513]">
                <div className="max-w-3xl mx-auto space-y-6">
                  
                  {/* Applied Custom Styling dynamically */}
                  <h1 
                    style={{ 
                      fontFamily: activePair.headingFont,
                      fontSize: `${fontSizeHeading}px`,
                      lineHeight: '1.15'
                    }}
                    className="text-neutral-900 dark:text-neutral-50 tracking-tight transition-all"
                  >
                    {customHeading || activePair.headingText}
                  </h1>

                  <p 
                    style={{ 
                      fontFamily: activePair.bodyFont,
                      fontSize: `${fontSizeBody}px`,
                      lineHeight: '1.7'
                    }}
                    className="text-neutral-600 dark:text-neutral-300 font-light transition-all"
                  >
                    {customBody || activePair.bodyText}
                  </p>
                </div>
              </div>

              {/* Quick Reset Button */}
              {(customHeading || customBody || fontSizeHeading !== 48 || fontSizeBody !== 16) && (
                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      setCustomHeading("");
                      setCustomBody("");
                      setFontSizeHeading(48);
                      setFontSizeBody(16);
                    }}
                    className="text-xs bg-neutral-200 dark:bg-neutral-800 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Reset Sandbox Defaults
                  </button>
                </div>
              )}

            </div>
          )}

        </main>

      </div>
      
    </div>
  );
}