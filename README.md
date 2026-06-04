# [Wanderly](https://wanderly.jawadiftikhar.com) — Bespoke Travel Itineraries, Thoughtfully Crafted

Wanderly is an interactive single-page luxury travel itinerary planner and concierge agency portfolio theme. Pairing advanced AI-assisted logistical drafting with on-the-ground, human-curated expert editors, the theme is styled in a warm natural color palette. Engineered with semantic HTML5, Tailwind CSS, and optimized modular vanilla JavaScript, it includes client-side e-commerce modules—such as a live budget planner sandbox and a premium hotel privileges registry—entirely free of heavy external frameworks.

Developed by [Jawad Iftikhar](https://github.com/jawadiftikhar-dev).

---

## 🚀 Key Features & UX Modules

* **Interactive AI vs. Human Split Slider:** A highly custom, drag-and-slide comparison block allowing users to dynamically reveal the differences between raw algorithmic drafts and polished human curation.
* **Dynamic Itinerary Sandbox:** A client-side state container that updates destination templates (Kyoto, Patagonia, Amalfi), pacing, and vibes, rendering real-time custom timelines and cost calculations.
* **Preferred Perks & Gifting Catalog:** An interactive, tabbed privileges ledger displaying exclusive amenities at partner properties (Aman, Belmond, Six Senses) with integrated editor insights.
* **Horizontal Timeline Carousel:** A customized horizontal scrolling timeline track with scroll-snap alignment and keyboard-accessible navigation buttons.
* **Magnetic Custom Cursor:** A smooth, pointer-following cursor dot and trailing ring utilizing coordinate linear interpolation (Lerp) inside a lightweight animation loop.
* **Expert Editor Region Filters:** An interactive region selection filter (All, Europe, Asia, Africa, Americas) sorting local travel editors dynamically.
* **Custom Media Player:** An optimized inline HTML5 video player with customized controls and a smooth backdrop fade-out overlay.
* **Numerical Stats Ticker:** Eased count-up meters that animate to final target metrics on viewport intersection.
* **Accessible CSS-Grid Accordions:** Responsive, keyboard-navigable FAQ modules utilizing clean CSS `grid-template-rows` animations to expand and collapse smoothly.
* **Fluid Typographic & Spacing Scales:** Native design variables calculating fluid typographic limits and spacing increments across standard viewports.

---

## 📂 File & Directory Structure

To extend this single-file setup (`Wanderly.html`) into a production-ready, modular repository structure, organize your directories as follows:

```text
Wanderly/
├── index.html                   # Core single-page layout & structural elements
├── LICENSE                      # Mozilla Public License 2.0 (MPL-2.0)
├── README.md                    # Project documentation & setup instructions
├── assets/                      # Static assets and media files
│   └── images/                  # Performance-optimized theme imagery (WebP/SVG)
├── styles/                      # Stylesheets folder
│   ├── design-system.css        # Design & Roots
│   └── global.css               # Global Styling
└── scripts/                     # Vanilla JS modular scripts
    ├── bootstrap.js             # Bootstraps functions & Integrations
    ├── core.js                  # Core Functionalities
    ├── data.js                  # Data & Arrays
    └── modules.js               # Modules & Components

🛠️ Codebase Architecture

1. HTML Outline & Metadata Integrity

The template utilizes structured markup patterns to ensure clean accessibility
and metadata consistency:

  - Semantic SEO Metadata: Optimized with distinct Meta descriptions, Open Graph
    targets, Twitter Cards, resource hints (preconnect), and localized parameter
    scales.
  - Accessible Navigation: Contains a visually hidden .skip-link layer enabling
    direct bypass of global headers for assistive devices.
  - Structured Data Integration: Features schema-ready metadata structures to
    declare localized services and business contact info directly to indexing
    engines.

2. Design Tokens & Styling Alias Framework

Theme colors and scale boundaries are declared as custom CSS variables to
establish a unified spacing scale:

:root {
  /* Core Brand Colors */
  --c-ivory: #fbf7f0;
  --c-paper: #f4ede1;
  --c-cream: #ede3d0;
  --c-forest: #0e3b2e;
  --c-ink: #17140f;
  --c-mute: #6b6157;
  --c-line: rgba(23, 20, 15, 0.12);

  /* Fluid Spacing & Typography */
  --space-md: clamp(0.75rem, 0.68rem + 0.3vw, 0.95rem);
  --text-xl: clamp(1.6rem, 1.45rem + 0.75vw, 2.0rem);
}

  - Tailored Color Selections: Contrast ratios (such as --c-terra-text and
    --c-gold-text) are customized to meet WCAG AA legibility criteria against
    light ivory backgrounds.
  - Modern CSS Reset: Implements high-fidelity styling components (e.g., custom
    form inputs, image zoom containers) alongside default system structures.

3. JavaScript Transactional Architecture

Scripts are isolated in a self-executing modular closure (IIFE) that handles
state mutations securely and isolates variables:

(function () {
    "use strict";

    // Centralized Publish/Subscribe Reactive State Container
    const createStore = (initialState) => {
        let state = { ...initialState };
        const listeners = new Set();
        return {
            getState: () => state,
            setState(nextState) {
                state = { ...state, ...nextState };
                listeners.forEach((fn) => fn(state));
            },
            subscribe(fn) {
                listeners.add(fn);
                return () => listeners.delete(fn);
            }
        };
    };
})();

Event Delegation Pattern

Rather than attaching event listeners to individual items, interactive elements
use centralized event delegation bound to parent containers. This keeps memory
usage optimal and ensures dynamic elements are covered:

on(this.tabs, "click", (e) => {
    const b = e.target.closest(".tab-btn");
    if (b) {
        this.render(b.textContent.trim());
    }
});

Composite WAAPI Translations

To track mouse coordinates cleanly without layout thrashing, coordinates are
translated using the Web Animations API (WAAPI), executing rendering
calculations directly on the browser's compositor thread:

this.dot.style.transform = `translate3d(${this.mx}px, ${this.my}px, 0) translate(-50%, -50%) scale(${this.scaleDot})`;
this.ring.style.transform = `translate3d(${this.rx}px, ${this.ry}px, 0) translate(-50%, -50%) scale(${this.scaleRing})`;

💻 Getting Started & Local Setup

Installation

1.  Clone the repository to your local drive:
    git clone https://github.com/jawadiftikhar-dev/Wanderly.git
    cd Wanderly
2.  Rename the main template file to index.html if you want to deploy it as a
    single-file template:
    mv Wanderly.html index.html
3.  Run the project locally using a basic HTTP server. For example, using
    Python's built-in module:
    python -m http.server 8000
4.  Open your web browser and navigate to: http://localhost:8000

🎨 Customization Guide

Designing Custom Color Palettes

To modify the organic minimal look, update the color variables declared in the
:root variables block:

:root {
  --c-ivory: #fbf7f0;       /* Main page background */
  --c-forest: #0e3b2e;      /* Theme brand color (forest green) */
  --c-ink: #17140f;         /* Primary typography dark color */
  --c-terra: #c65d3b;       /* Primary brand accent (terracotta) */
}

Extending Sandbox Destinations

To add new destinations to your live sandbox, modify the datasets declared in
the local JavaScript data layer. The client-side state engine and cost
calculator will automatically update to reflect any dataset changes:

// Adding a destination to the local database
const sandboxDB = {
  Kyoto: {
    url: "wanderly.app/drafts/kyoto",
    price: "$5,240",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    title: "Day 3 · Arashiyama, 06:40",
    sub: "Private bamboo grove walk before public crowd arrival.",
    Quiet: {
      Cultural: [
        { d: "01", t: "Arrive Kansai", p: "Check-in to Gion Zen Ryokan", c: "$840" }
      ]
    }
  }
};

♿ Accessibility & Performance Details

Accessibility Standards

  - Contrast Compliance: Typography and accent colors are configured to meet
    WCAG AA contrast ratios against light ivory backdrops.
  - ARIA & Focus Overrides: Custom inputs, form components, and carousel slide
    triggers are styled with clear, keyboard-compliant focus outlines
    (:focus-visible) and include necessary accessibility labels.
  - Reduced Motion Preferences: Automatically overrides transitions, floating
    animations, particle rendering, and coordinate offsets if the user has
    requested reduced motion (prefers-reduced-motion: reduce).

Performance Optimizations

  - Scroll Performance: Scroll handlers are configured as { passive: true } to
    keep viewport scrolling smooth and prevent main-thread blocking.
  - DOM Compilation: Uses document fragments during sandbox updates to compile
    HTML strings and mount them to the DOM tree in a single repaint.

