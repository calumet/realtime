/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | Initializator
 * Romel Pérez, @prhonedev
 * Duvan Vargas, @DuvanJamid
 * Marzo del 2014
 **/

var app = app || {};

// Aplicación descargada
jQuery(document).ready(function () {

    // Iniciar Aplicación
    app.init();

    // Complementario
    $('*[title]').toolTip();

});

// Cuando la ventana se redimensione
jQuery(window).resize(app.tool.win);
