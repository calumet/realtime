/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | Aula
 * Romel Pérez, @prhonedev
 * Duvan Vargas, @DuvanJamid
 * Febrero del 2014
 **/

// ------------------------------------------------------------------------- //
// APPLICATION //

var app = app || {};

app.config = {
    server: 'http://localhost:9000'
};

app.user = null;  // Return the user data

app.init = function () {
    // Load user data
    $.ajax({
        type: 'post',
        url: app.config.server + '/getUserData',
        data: {
            room: app.data.room,
            code: app.data.code
        },
        success: function (data) {
            app.user = {
                user: function () { return data.user; },
                room: function () { return data.room; }
            };
        },
        error: function (err) {
            console.log('>>> Error while loading user data.');
        }
    });
};


// ------------------------------------------------------------------------- //
// DOM EVENTS //

$(document).ready(function () {

    // Load data from server
    app.init();

    // Show chat info
    $('#chat').on('click', function () {
        // Show chat info
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
                btnClick: function() {
                    // Create chat window
                    Elise.popup({
                        position: 'full',
                        url: '/chat'
                    });
                }
            }]
        });
    });

});
