/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | Initializator
 * Romel Pérez, @prhonedev
 * Duvan Vargas, @DuvanJamid
 * Marzo del 2014
 **/

var app = app || {};

// DOM Content Loaded
jQuery(document).ready(function () {

    // Start
    app.init();

    // Complementary
    $('*[title]').toolTip();

});

// Window Resized
jQuery(window).resize(app.tool.win);
