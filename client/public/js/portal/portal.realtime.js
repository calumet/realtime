/*!
 * Grupo de Desarrollo de Software Calumet
 * Portal | Portal-Realtime
 * Romel Pérez, @prhonedev
 * 2014
 **/

var portal = portal || {};

// Inicializador
portal.manager = function (e) {

    var ev, emit;

    // Conectar
    portal.socket = io.connect(portal.server.url + '/portal', {
        query: 'userid=' + portal.user.id
    });

    // Asignar eventos
    for (ev in portal.events) {
        if (typeof portal.events[ev] === 'function') {
            portal.socket.on(ev, portal.events[ev]);
        }
    }

    // Asignar emitidores
    for (emit in portal.emits) {
        if (typeof portal.events[ev] === 'function') {
            portal.emits[emit].apply(io);
        }
    }

};

// Eventos
portal.events = {

    connect: function (data) {
        portal.ready = true;
        console.log('conectado: ', data);
    },

    error: function (data) {
        // TODO: Qué hacer cuando el usuario no se pudo conectar por sockets?
        // Dependiento del caso, se debe tomar acción.
        console.log('error: ', data);
    },

    'portal:msg': function (data) {
        Elise.alert(data.message, {type: 'info'});
        console.log('portal:msg: ', data);
    }

};

// Emitidores
portal.emits = {};

$(function ($) {

    // Conseguir el socket del cliente
    $.getScript(portal.server.url +'/socket.io/socket.io.js')
    .done(portal.manager)
    .fail(function (err) {
        throw err;
    });

});
