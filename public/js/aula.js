/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | Aula
 * Romel Pérez, @prhonedev
 * Duvan Vargas, @DuvanJamid
 * Marzo del 2014
 **/

// ------------------------------------------------------------------------- //
// APPLICATION //

var app = app || {};

app.data = app.data || {};

app.chat = {

    // Sockets server
    server: 'http://localhost:9000',

    // Return user data
    user: null,

    // Load user data
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
                console.debug('>>> Error while loading user data.');
            }
        });
    },

    // Create the chat window
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

    // Load data from server
    app.chat.init();

    // Show chat info
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
