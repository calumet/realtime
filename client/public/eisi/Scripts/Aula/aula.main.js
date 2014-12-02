/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | Aula
 * Romel Pérez, prhone.blogspot.com
 * Duvan Vargas, @DuvanJamid
 * Marzo del 2014
 **/

// ------------------------------------------------------------------------- //
// APPLICATION //

var app = app || {};

app.data = app.data || {};

app.chat = {

    // Conexión con el servidor de sockets
    server: 'http://localhost:9000',

    // Retornar datos de usuario
    user: null,

    // Cargar datos y configuración
    init: function () {
        $.ajax({
            type: 'post',
            url: app.chat.server + '/getUserById',
            data: {id: app.data.id},
            success: function (data) {
                app.chat.user = {
                    user: function () {
                        return data.user;
                    },
                    clase: function (val) {
                        // Save var
                        return function () {
                            return val;
                        };
                    } (app.data.clase)
                };
            },
            error: function (err) {
                console.debug('>>> Error conectando con el servidor.');
            }
        });
    },

    // Crear la ventana de chat
    create: function () {
        Elise.popup({
            position: 'full',
            url: '/chat'
        });
    }

};


// ------------------------------------------------------------------------- //
// DOM EVENTS //

$(document).ready(function () {

    // Iniciar cargado de datos y configuración
    app.chat.init();

    // Mostrar información de chat
    $('#chat').on('click', function () {
        eModal({
            title: 'Información del Chat',
            container: 'chatMsg',
            emodalWidth: 400,
            emodalContentHeight: 200,
            buttons: [{
                btnText: 'Entrar',
                btnClass: 'emodal_hide',
                btnColor: 'azul',
                btnPosition: 'right',
                btnClick: app.chat.create
            }]
        });
    });

});
