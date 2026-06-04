// wanderly-modules.js
(function() {
    "use strict";

    window.Wanderly = window.Wanderly || {};

    const { $, $$, on, escapeHTML, DOM, createStore, Database } = window.Wanderly;

    // ==========================================================================
    // LAYER 3: MODULAR COMPONENT SYSTEMS
    // ==========================================================================
    const App = {
        modules: {},

        register(name, module) {
            this.modules[name] = module;
        },

        init() {
            try {
                Object.keys(this.modules).forEach((name) => {
                    if (this.modules[name] && typeof this.modules[name].init === "function") {
                        this.modules[name].init();
                    }
                });
            } catch (err) {
                console.error("App lifecycle initialization error:", err);
            }
        }
    };

    // --- 1. Custom Cursor Module ---
    App.register("cursor", {
        init() {
            this.dot = $("#cursorDot");
            this.ring = $("#cursorRing");
            if (!this.dot || !this.ring) return;

            this.mx = 0;
            this.my = 0;
            this.rx = 0;
            this.ry = 0;
            this.scaleDot = 1;
            this.scaleRing = 1;
            this.borderColor = "rgba(14,59,46,.35)";

            this.bindEvents();
            this.loop();
        },

        bindEvents() {
            this.onMouseMove = (e) => {
                this.mx = e.clientX;
                this.my = e.clientY;
            };

            this.onMouseOver = (e) => {
                if (e.target.closest('a,button,input,textarea,select,label,[role="tab"]')) {
                    this.scaleDot = 2.75;
                    this.scaleRing = 1.526;
                    this.borderColor = "rgba(198,93,59,.6)";
                }
            };

            this.onMouseOut = (e) => {
                if (e.target.closest('a,button,input,textarea,select,label,[role="tab"]')) {
                    this.scaleDot = 1.0;
                    this.scaleRing = 1.0;
                    this.borderColor = "rgba(14,59,46,.35)";
                }
            };

            on(window, "mousemove", this.onMouseMove, { passive: true });
            on(document, "mouseover", this.onMouseOver, { passive: true });
            on(document, "mouseout", this.onMouseOut, { passive: true });
        },

        loop() {
            const step = () => {
                this.rx += (this.mx - this.rx) * 0.18;
                this.ry += (this.my - this.ry) * 0.18;

                this.dot.style.transform = `translate3d(${this.mx}px, ${this.my}px, 0) translate(-50%, -50%) scale(${this.scaleDot})`;
                this.ring.style.transform = `translate3d(${this.rx}px, ${this.ry}px, 0) translate(-50%, -50%) scale(${this.scaleRing})`;
                this.ring.style.borderColor = this.borderColor;

                this.raf = requestAnimationFrame(step);
            };
            this.raf = requestAnimationFrame(step);
        },

        destroy() {
            cancelAnimationFrame(this.raf);
            window.removeEventListener("mousemove", this.onMouseMove);
            document.removeEventListener("mouseover", this.onMouseOver);
            document.removeEventListener("mouseout", this.onMouseOut);
        }
    });

    // --- 2. Sticky Nav Module ---
    App.register("stickyNav", {
        init() {
            this.nav = $("#nav");
            if (!this.nav) return;

            this.onScroll = () => {
                if (window.scrollY > 20) {
                    this.nav.classList.add("nav-scrolled");
                } else {
                    this.nav.classList.remove("nav-scrolled");
                }
            };

            on(window, "scroll", this.onScroll, { passive: true });
            this.onScroll();
        }
    });

    // --- 3. Mobile Menu Module ---
    App.register("mobileMenu", {
        init() {
            this.menuBtn = $("#menuBtn");
            this.menu = $("#menu");
            if (!this.menuBtn || !this.menu) return;

            on(this.menuBtn, "click", () => {
                const isOpen = this.menu.classList.toggle("hidden") === false;
                this.menuBtn.setAttribute("aria-expanded", isOpen);
            });

            on(this.menu, "click", (e) => {
                if (e.target.closest("a")) {
                    this.menu.classList.add("hidden");
                    this.menuBtn.setAttribute("aria-expanded", "false");
                }
            });
        }
    });

    // --- 4. Scroll Reveal Module ---
    App.register("revealOnScroll", {
        init() {
            this.elements = $$(".reveal, .reveal-stagger");
            if (!this.elements.length) return;

            this.observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((e) => {
                        if (e.isIntersecting) {
                            e.target.classList.add("in");
                            this.observer.unobserve(e.target);
                        }
                    });
                },
                { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
            );

            this.elements.forEach((el) => this.observer.observe(el));
        },

        destroy() {
            if (this.observer) this.observer.disconnect();
        }
    });

    // --- 5. Numeric Ticker Counters Module ---
    App.register("tickers", {
        init() {
            this.elements = $$(".ticker");
            if (!this.elements.length) return;

            this.observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((e) => {
                        if (!e.isIntersecting) return;
                        const el = e.target;
                        const end = +el.dataset.target || 0;
                        const suf = el.dataset.suffix || "";
                        const dur = 1600;
                        const t0 = performance.now();

                        const tick = (t) => {
                            const p = Math.min(1, (t - t0) / dur);
                            const eased = 1 - Math.pow(1 - p, 3);
                            const v = Math.floor(eased * end);
                            el.textContent = v.toLocaleString() + suf;

                            if (p < 1) {
                                requestAnimationFrame(tick);
                            } else {
                                el.textContent = end.toLocaleString() + suf;
                            }
                        };

                        requestAnimationFrame(tick);
                        this.observer.unobserve(el);
                    });
                },
                { threshold: 0.5 }
            );

            this.elements.forEach((el) => this.observer.observe(el));
        },

        destroy() {
            if (this.observer) this.observer.disconnect();
        }
    });

    // --- 6. FAQ Accordion Module ---
    App.register("accordion", {
        init() {
            this.faq = $("#faq");
            if (!this.faq) return;

            on(this.faq, "click", (e) => {
                const btn = e.target.closest(".acc-btn");
                if (!btn) return;

                const item = btn.parentElement;
                const isOpen = item.classList.contains("open");

                $$(".acc-item", this.faq).forEach((i) => {
                    i.classList.remove("open");
                    const accordionBtn = i.querySelector(".acc-btn");
                    if (accordionBtn) {
                        accordionBtn.setAttribute("aria-expanded", "false");
                    }
                });

                if (!isOpen) {
                    item.classList.add("open");
                    btn.setAttribute("aria-expanded", "true");
                }
            });
        }
    });

    // --- 7. Styles Tab Filter Panel Module ---
    App.register("styleTabs", {
        init() {
            this.tabs = $("#styleTabs");
            this.grid = $("#styleGrid");
            if (!this.tabs || !this.grid) return;

            this.bindEvents();
            this.render("Slow & cultural");
        },

        bindEvents() {
            on(this.tabs, "click", (e) => {
                const b = e.target.closest(".tab-btn");
                if (!b) return;

                $$(".tab-btn", this.tabs).forEach((t) => {
                    t.classList.remove("bg-[color:var(--c-ivory)]", "text-[color:var(--c-forest)]", "font-medium");
                    t.classList.add("border", "border-[color:var(--c-ivory)]/30");
                    t.setAttribute("aria-selected", "false");
                });

                b.classList.add("bg-[color:var(--c-ivory)]", "text-[color:var(--c-forest)]", "font-medium");
                b.classList.remove("border", "border-[color:var(--c-ivory)]/30");
                b.setAttribute("aria-selected", "true");

                this.render(b.textContent.trim());
            });
        },

        async render(key) {
            try {
                this.grid.style.opacity = "0.4";
                const items = await Database.getStyleData(key);

                const html = items.map((x) => `
                <article class="rounded-[var(--r-lg)] overflow-hidden lift bg-[color:var(--c-ivory)]/5 border border-white/10">
                    <div class="zoom aspect-[4/3] relative">
                        <img src="${escapeHTML(x.i)}" alt="${escapeHTML(x.t)}" loading="lazy" class="absolute inset-0 w-full h-full object-cover"/>
                    </div>
                    <div class="p-6">
                        <h3 class="font-display text-xl text-[color:var(--c-ivory)]">${escapeHTML(x.t)}</h3>
                        <p class="mt-2 opacity-70 text-sm">${escapeHTML(x.p)}</p>
                        <a href="#" class="mt-4 inline-flex items-center gap-2 ulink text-sm">View itinerary →</a>
                    </div>
                </article>
                `).join("");

                DOM.safeRender(this.grid, html);
            } catch (err) {
                console.error("Style panel render failed:", err);
            } finally {
                this.grid.style.opacity = "1";
            }
        }
    });

    // --- 8. Timeline Module ---
    App.register("timeline", {
        init() {
            this.tl = $("#tlTrack");
            if (!this.tl) return;

            this.bindEvents();
            this.render();
        },

        bindEvents() {
            on($("#tlPrev"), "click", () => {
                this.tl.scrollBy({ left: -340, behavior: "smooth" });
            });

            on($("#tlNext"), "click", () => {
                this.tl.scrollBy({ left: 340, behavior: "smooth" });
            });
        },

        async render() {
            try {
                const data = await Database.getTimelineDays();
                const html = data.map((d) => `
                <article class="tl-card bg-white rounded-[var(--r-lg)] overflow-hidden lift border border-[color:var(--c-line)]">
                    <div class="zoom aspect-[4/3] relative">
                        <img src="${escapeHTML(d.i)}" alt="${escapeHTML(d.t)}" loading="lazy" class="absolute inset-0 w-full h-full object-cover"/>
                        <span class="absolute top-3 left-3 chip">Day ${escapeHTML(d.d)}</span>
                    </div>
                    <div class="p-5">
                        <h4 class="font-display text-lg leading-tight">${escapeHTML(d.t)}</h4>
                        <p class="text-sm text-[color:var(--c-mute)] mt-2">${escapeHTML(d.p)}</p>
                    </div>
                </article>
                `).join("");

                DOM.safeRender(this.tl, html);
            } catch (err) {
                console.error("Timeline render failed:", err);
            }
        }
    });

    // --- 9. Testimonials Carousel Module ---
    App.register("testimonials", {
        init() {
            this.track = $("#tsTrack");
            this.dots = $("#tsDots");
            if (!this.track || !this.dots) return;

            this.bindEvents();
            this.render();
        },

        bindEvents() {
            this.onScroll = () => this.updateDots();
            on(this.track, "scroll", this.onScroll, { passive: true });

            on(this.dots, "click", (e) => {
                const d = e.target.closest(".tsdot");
                if (!d) return;

                const allDots = $$(".tsdot", this.dots);
                const idx = allDots.indexOf(d);
                const slide = this.track.querySelector(".slide");

                if (idx !== -1 && slide) {
                    const w = slide.offsetWidth + 24;
                    this.track.scrollTo({ left: idx * w, behavior: "smooth" });
                }
            });

            on($("#tsPrev"), "click", () => {
                this.track.scrollBy({ left: -584, behavior: "smooth" });
            });

            on($("#tsNext"), "click", () => {
                this.track.scrollBy({ left: 584, behavior: "smooth" });
            });
        },

        async render() {
            try {
                const data = await Database.getTestimonials();

                const slideHtml = data.map((t) => `
                <article class="slide w-[min(86vw,560px)] bg-white border border-[color:var(--c-line)] rounded-[var(--r-lg)] p-8 md:p-10 shadow-[var(--shadow-sm)]">
                    <p class="font-display text-2xl md:text-[28px] leading-snug balance">"${escapeHTML(t.q)}"</p>
                    <div class="mt-8 flex items-center gap-4">
                        <img src="${escapeHTML(t.i)}" alt="${escapeHTML(t.n)}" class="w-12 h-12 rounded-full object-cover" loading="lazy"/>
                        <div>
                            <p class="font-medium">${escapeHTML(t.n)}</p>
                            <p class="text-sm text-[color:var(--c-mute)]">${escapeHTML(t.l)}</p>
                        </div>
                        <span class="ml-auto text-[color:var(--c-gold)] text-lg" aria-label="5 stars">★★★★★</span>
                    </div>
                </article>
                `).join("");

                const dotsHtml = data.map((_, i) => `
                <button class="tsdot w-2.5 h-2.5 rounded-full bg-[color:var(--c-ink)]/20 transition cursor-pointer" aria-label="Testimonial ${i + 1}"></button>
                `).join("");

                DOM.safeRender(this.track, slideHtml);
                DOM.safeRender(this.dots, dotsHtml);

                this.updateDots();
            } catch (err) {
                console.error("Testimonials template rendering failed:", err);
            }
        },

        updateDots() {
            const slide = this.track.querySelector(".slide");
            if (!slide) return;

            const w = slide.offsetWidth + 24;
            const idx = Math.round(this.track.scrollLeft / w);

            $$(".tsdot", this.dots).forEach((d, i) => {
                const isActive = i === idx;
                d.classList.toggle("bg-[color:var(--c-forest)]", isActive);
                d.classList.toggle("bg-[color:var(--c-ink)]/20", !isActive);
            });
        },

        destroy() {
            if (this.track) {
                this.track.removeEventListener("scroll", this.onScroll);
            }
        }
    });

    // --- 10. Hero Parallax Module ---
    App.register("parallax", {
        init() {
            this.heroImgs = $$(".parallax-layer");
            if (!this.heroImgs.length) return;

            this.onScroll = () => {
                const y = window.scrollY;
                this.heroImgs.forEach((el) => {
                    el.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
                });
            };

            on(window, "scroll", this.onScroll, { passive: true });
        },

        destroy() {
            window.removeEventListener("scroll", this.onScroll);
        }
    });

    // --- 11. Interactive Co-Creation Panel Slider Module ---
    App.register("splitSlider", {
        init() {
            this.container = $(".split-container");
            this.panel = $("#humanPanel");
            this.handle = $("#splitHandle");
            this.button = $("#splitButton");

            if (!this.container || !this.panel || !this.handle || !this.button) return;

            this.bindEvents();
        },

        bindEvents() {
            const slideTo = (clientX) => {
                const rect = this.container.getBoundingClientRect();
                let percentage = (clientX - rect.left) / rect.width;
                percentage = Math.max(0, Math.min(1, percentage));

                const percentVal = (percentage * 100).toFixed(2);
                this.panel.style.width = `${percentVal}%`;
                this.handle.style.left = `${percentVal}%`;
                this.button.style.left = `${percentVal}%`;
            };

            this.onMouseMove = (e) => slideTo(e.clientX);
            this.onTouchMove = (e) => {
                if (e.touches && e.touches[0]) {
                    slideTo(e.touches[0].clientX);
                }
            };

            on(this.container, "mousemove", this.onMouseMove, { passive: true });
            on(this.container, "touchmove", this.onTouchMove, { passive: true });
        },

        destroy() {
            if (this.container) {
                this.container.removeEventListener("mousemove", this.onMouseMove);
                this.container.removeEventListener("touchmove", this.onTouchMove);
            }
        }
    });

    // --- 12. Playable Video Engine Module ---
    App.register("videoEngine", {
        init() {
            this.video = $("#moodVideo");
            this.overlay = $("#videoOverlay");
            this.playBtn = $("#videoPlayBtn");
            this.playIcon = $("#playIcon");
            this.pauseIcon = $("#pauseIcon");
            this.btnActionWatch = $("#btnActionWatch");

            if (!this.video) return;

            this.bindEvents();
        },

        togglePlay() {
            if (this.video.paused) {
                this.video.play();
                this.playIcon.classList.add("hidden");
                this.pauseIcon.classList.remove("hidden");
                this.overlay.classList.add("opacity-0", "pointer-events-none");
            } else {
                this.video.pause();
                this.playIcon.classList.remove("hidden");
                this.pauseIcon.classList.add("hidden");
                this.overlay.classList.remove("opacity-0", "pointer-events-none");
            }
        },

        bindEvents() {
            on(this.playBtn, "click", (e) => {
                e.stopPropagation();
                this.togglePlay();
            });

            on(this.video.parentElement, "click", () => {
                this.togglePlay();
            });

            on(this.btnActionWatch, "click", (e) => {
                e.preventDefault();
                this.video.scrollIntoView({ behavior: "smooth", block: "center" });
                setTimeout(() => {
                    if (this.video.paused) this.togglePlay();
                }, 600);
            });
        }
    });

    // --- 13. Sandbox Simulator Engine Module ---
    App.register("sandbox", {
        init() {
            this.store = createStore({
                dest: "Kyoto",
                pace: "Quiet",
                vibe: "Cultural"
            });

            this.bindEvents();
            this.store.subscribe(() => this.render());
            this.render();
        },

        bindEvents() {
            const configureGroup = (containerId, stateKey) => {
                const container = $(containerId);
                if (!container) return;

                on(container, "click", (e) => {
                    const btn = e.target.closest("button");
                    if (!btn) return;

                    $$("button", container).forEach((b) => {
                        b.classList.remove("bg-[color:var(--c-forest)]", "text-white", "font-medium");
                        b.classList.add("bg-white", "border", "border-[color:var(--c-line)]", "text-[color:var(--c-ink)]", "hover:bg-[color:var(--c-cream)]");
                    });

                    btn.classList.add("bg-[color:var(--c-forest)]", "text-white", "font-medium");
                    btn.classList.remove("bg-white", "border-[color:var(--c-line)]", "text-[color:var(--c-ink)]", "hover:bg-[color:var(--c-cream)]");

                    this.store.setState({ [stateKey]: btn.dataset.val });
                });
            };

            configureGroup("#sandboxDest", "dest");
            configureGroup("#sandboxPace", "pace");
            configureGroup("#sandboxVibe", "vibe");

            on($("#btnLiveRegen"), "click", () => {
                const box = $("#livePreviewBox");
                if (box) {
                    box.style.opacity = "0.4";
                    box.style.transform = "scale(0.98)";
                    box.style.transition = "all 0.3s ease";
                    setTimeout(() => {
                        this.render();
                        box.style.opacity = "1";
                        box.style.transform = "none";
                    }, 300);
                }
            });
        },

        async render() {
            const { dest, pace, vibe } = this.store.getState();
            const liveUrl = $("#liveUrl");
            const livePrice = $("#livePrice");
            const liveImg = $("#liveImg");
            const liveDayTitle = $("#liveDayTitle");
            const liveDaySub = $("#liveDaySub");
            const liveDayList = $("#liveDayList");

            try {
                const data = await Database.getSandboxData(dest);
                if (!data) return;

                const events = data[pace][vibe];

                if (liveUrl) liveUrl.textContent = data.url;
                if (livePrice) {
                    DOM.safeRender(livePrice, `${escapeHTML(data.price)} <span class="text-sm text-[color:var(--c-mute)] font-sans">· 2 travelers</span>`);
                }
                if (liveImg) liveImg.src = data.img;
                if (liveDayTitle) liveDayTitle.textContent = data.title;
                if (liveDaySub) liveDaySub.textContent = data.sub;

                if (liveDayList) {
                    const listHtml = events.map((ev) => `
                    <div class="flex items-center gap-3 p-3 rounded-[var(--r-sm)] bg-[color:var(--c-paper)] hover:bg-[color:var(--c-cream)] transition-colors duration-200">
                        <span class="w-10 h-10 rounded-lg bg-[color:var(--c-forest)] text-white grid place-items-center font-display">${escapeHTML(ev.d)}</span>
                        <div class="flex-1 text-sm">
                            <strong>${escapeHTML(ev.t)}</strong>
                            <p class="text-[color:var(--c-mute)] text-xs">${escapeHTML(ev.p)}</p>
                        </div>
                        <span class="text-xs text-[color:var(--c-mute)]">${escapeHTML(ev.c)}</span>
                    </div>
                    `).join("");

                    DOM.safeRender(liveDayList, listHtml);
                }
            } catch (err) {
                console.error("Sandbox component render failed:", err);
            }
        }
    });

    // --- 14. Exclusive Perks Selector Module ---
    App.register("perks", {
        init() {
            this.perkTabs = $$(".perk-tab-btn");
            if (!this.perkTabs.length) return;

            this.bindEvents();
            this.render("Aman");
        },

        bindEvents() {
            this.perkTabs.forEach((btn) => {
                on(btn, "click", () => {
                    this.perkTabs.forEach((b) => {
                        b.className = "perk-tab-btn text-left p-6 rounded-xl border border-[color:var(--c-line)] hover:border-[color:var(--c-forest)] transition-all duration-300";
                        const innerP = b.querySelector("p");
                        if (innerP) {
                            innerP.className = "font-display text-xl text-[color:var(--c-ink)]";
                        }
                    });

                    btn.className = "perk-tab-btn text-left p-6 rounded-xl border border-[color:var(--c-forest)] bg-[color:var(--c-ivory)] transition-all duration-300";
                    const activeP = btn.querySelector("p");
                    if (activeP) {
                        activeP.className = "font-display text-xl text-[color:var(--c-forest)]";
                    }

                    const key = btn.id.replace("perk", "");
                    this.render(key);
                });
            });
        },

        async render(key) {
            const card = $("#perksContentCard");
            if (!card) return;

            try {
                card.style.opacity = "0.4";
                const pData = await Database.getPerksData(key);
                if (!pData) return;

                const listItems = pData.list.map((l) => `
                <li class="flex items-start gap-2">
                    <span class="text-[color:var(--c-terra)] font-bold shrink-0">✓</span>
                    <span>${escapeHTML(l)}</span>
                </li>
                `).join("");

                const content = `
                <div class="space-y-4">
                    <span class="chip">Perk Benefit Sheet</span>
                    <h3 class="font-display text-2xl md:text-3xl">${escapeHTML(pData.headline)}</h3>
                    <p class="text-sm text-[color:var(--c-mute)]">${escapeHTML(pData.sub)}</p>
                    <ul class="mt-4 space-y-2 text-sm text-[color:var(--c-ink)]" role="list">
                        ${listItems}
                    </ul>
                </div>
                <div class="mt-8 pt-6 border-t border-[color:var(--c-line)] italic text-xs text-[color:var(--c-mute)]">
                    "${escapeHTML(pData.quote)}" <span class="block mt-1 font-semibold not-italic">— ${escapeHTML(pData.author)}</span>
                </div>
                `;

                DOM.safeRender(card, content);
            } catch (err) {
                console.error("Perks module render failed:", err);
            } finally {
                card.style.opacity = "1";
            }
        }
    });

    // --- 15. Expert Editor Finder Module ---
    App.register("experts", {
        init() {
            this.filterBtns = $$("#expertFilters button");
            if (!this.filterBtns.length) return;

            this.bindEvents();
            this.render("All");
        },

        bindEvents() {
            this.filterBtns.forEach((btn) => {
                on(btn, "click", () => {
                    this.filterBtns.forEach((b) => {
                        b.className = "px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-full bg-white border border-[color:var(--c-line)] text-[color:var(--c-mute)] hover:text-[color:var(--c-ink)] transition-all cursor-pointer";
                    });

                    btn.className = "px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-full bg-[color:var(--c-forest)] text-white transition-all cursor-pointer";
                    this.render(btn.dataset.region);
                });
            });
        },

        async render(region) {
            const container = $("#expertCardsContainer");
            if (!container) return;

            try {
                container.style.opacity = "0.4";
                const filteredEditors = await Database.getEditors(region);

                const html = filteredEditors.map((ed) => `
                <div class="lift bg-white rounded-[var(--r-md)] overflow-hidden border border-[color:var(--c-line)] transition-all duration-300">
                    <div class="zoom aspect-square">
                        <img src="${escapeHTML(ed.img)}" alt="Portrait of editor ${escapeHTML(ed.name)}" class="w-full h-full object-cover"/>
                    </div>
                    <div class="p-5">
                        <h4 class="font-display text-xl">${escapeHTML(ed.name)}</h4>
                        <p class="text-sm text-[color:var(--c-mute)]">${escapeHTML(ed.region)} Editor · ${escapeHTML(ed.location)}</p>
                        <p class="text-xs text-[color:var(--c-mute)] mt-1">${escapeHTML(ed.exp)}</p>
                        
                        <div class="mt-4 pt-4 border-t border-[color:var(--c-line)]">
                            <p class="text-xs uppercase tracking-wider text-[color:var(--c-terra)] font-semibold">Local tip</p>
                            <p class="text-xs text-[color:var(--c-mute)] mt-1 leading-relaxed italic">"${escapeHTML(ed.tip)}"</p>
                        </div>
                    </div>
                </div>
                `).join("");

                DOM.safeRender(container, html);
            } catch (err) {
                console.error("Editors module render failed:", err);
            } finally {
                container.style.opacity = "1";
            }
        }
    });

    // --- Accessibility Check Integration ---
    App.register("accessibility", {
        init() {
            const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
            if (!motionOK) {
                $$(".reveal, .reveal-stagger").forEach((el) => {
                    el.classList.add("in");
                });
            }
        }
    });

    window.Wanderly.App = App;
})();