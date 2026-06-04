// wanderly-bootstrap.js
(function() {
    "use strict";

    window.Wanderly = window.Wanderly || {};

    // ==========================================================================
    // LAYER 4: APP INITIALIZATION
    // ==========================================================================
    const App = window.Wanderly.App;

    if (App && typeof App.init === "function") {
        App.init();
    } else {
        console.error("Wanderly: App not found or not properly initialized.");
    }
})();
