/*!
 * Grupo de Desarrollo de Software Calumet
 * Portal | Portal-Realtime
 * Romel Pérez, prhone.blogspot.com
 * 2014
 **/

/*
var data = {
    id: req.query.id,
    materia: req.query.clase,
    grupo: req.query.grupo,
    guion: req.query.guion,
    name: req.query.name,
    photo: req.query.photo,
    sockets: config.sockets
};
*/

window.portal = window.portal || {};

// Objectos ya inicializados:
// > porta.server
// > portal.user

// Inicializador
portal.manager = function (e) {

    var ev, emit;

    // Conectar
    portal.socket = io.connect(portal.server.url + '/portal', {
        query: 'userid=' + portal.user.id
    });

    // Asignar eventos
    for (ev in portal.events) {
        portal.socket.on(ev, portal.events[ev]);
    }

    // Asignar emitidores
    for (emit in portal.emits) {
        portal.emits[emit].apply(io);
    }
};

// Eventos
portal.events = {

    connect: function (data) {
        console.log('conectado:', data);
        $('#conn').html('conectado!');
    },

    error: function (data) {
        console.log('error:', data);
        $('#conn').html('error de conexión!');
    },

    'portal:msg': function (data) {
        console.log('portal:msg:', data);
        alert(data.message, {type: 'info'});
    }

};

// Emitidores
portal.emits = {

    // No hay emitidores hasta el momento.

};

// Al momento de carga de página
$(document).ready(function ($) {

    // Conseguir el socket del cliente
    $.getScript(portal.server.url +'/socket.io/socket.io.js')
    .done(portal.manager)
    .fail(function (err) {
        throw err;
    });
});
