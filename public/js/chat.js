/*!
 * PRHONE Applications
 * Chat | Initializator
 * Romel Pérez, 2014
 **/

var app = app || {};

// DOM Content Loaded
jQuery(document).ready(function () {
    app.init();
});

// Window Resized
jQuery(window).resize(app.tool.win);
