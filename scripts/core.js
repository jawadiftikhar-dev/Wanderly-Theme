// wanderly-core.js
(function () {
    "use strict";

    window.Wanderly = window.Wanderly || {};

    // ==========================================================================
    // LAYER 1: SYSTEM UTILITIES & RENDERING ENGINES
    // ==========================================================================
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

    /**
     * Recursive HTML escaping to prevent XSS vulnerability vectors
     */
    const escapeHTML = (str) => {
        if (typeof str !== 'string') return str;
        return str.replace(/[&<>'"]/g, (tag) => {
            return ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag);
        });
    };

    /**
     * Optimized DOM Compiler using Document Fragments to minimize browser repaints
     */
    const DOM = {
        parseHTML(htmlString) {
            const template = document.createElement("template");
            template.innerHTML = htmlString.trim();
            return template.content;
        },
        safeRender(container, htmlString) {
            if (!container) return;
            try {
                container.innerHTML = "";
                container.appendChild(this.parseHTML(htmlString));
            } catch (error) {
                console.error("DOM safeRender execution failed:", error);
            }
        }
    };

    /**
     * Lightweight Publish/Subscribe Reactive State Container
     */
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

    // Expose to global Wanderly object
    window.Wanderly.$ = $;
    window.Wanderly.$$ = $$;
    window.Wanderly.on = on;
    window.Wanderly.escapeHTML = escapeHTML;
    window.Wanderly.DOM = DOM;
    window.Wanderly.createStore = createStore;
})();