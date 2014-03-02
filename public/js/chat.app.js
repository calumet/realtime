/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | Client Application
 * Romel Pérez, @prhonedev
 * Duvan Vargas, @DuvanJamid
 * Febrero del 2014
 **/

var app = app || {};

// ------------------------------------------------------------------------- //
// CORE //

// Variables and configuration
app.socket = null;
app.aula = window.opener.app;
app.config = {
    server: app.aula.config.server
};
app.data = app.aula.user;


// Initialization
app.init = function () {

    // Neat
    app.tool.win();

    // Start check interval with main window
    app.popup.check();

    // Register DOM events
    app.dom.init();

    // Connect
    app.connect(function () {
        // Socket events
        app.events();

        // Register user on server
        app.emit.register();

        // Charge general room
        app.rooms.add({
            id: app.data.room(),
            type: 'general',
            users: []
        });
    });

};


// Connection to server
app.connect = function (started) {

    // Create connection with server
    var script = document.createElement('script');
    script.src = app.config.server + '/socket.io/socket.io.js';
    document.getElementsByTagName('body')[0].appendChild(script);

    // When the socket is charged
    script.onload = script.onreadystatechange = function () {
        app.socket = io.connect(app.config.server);
        started();
    };

};


// ------------------------------------------------------------------------- //
// SOCKET EVENTS //

app.events = function () {

    // Connected
    app.socket.on('connected', function () {
        console.debug('>>> Connected to server');
    });


    // Registered
    app.socket.on('registered', function (data) {
        console.debug('>>> Registered in server');
        var user;

        // Add all others users
        for (user in data.users) {
            app.users.add(data.users[user]);
        }

        // Set interface
        app.state.start();
        app.state.set('avail');
    });


    // User Registered
    app.socket.on('userRegistered', function (data) {
        app.users.add({
            id: data.id,
            user: data.user
        });
    });


    // User Unregistered
    app.socket.on('userUnregistered', function (id) {
        app.users.remove(id);
    });


    // User Messaged
    app.socket.on('userMsged', function (data) {
        app.messages.receive(data);
    });

};


// ------------------------------------------------------------------------- //
// SOCKET TRIGGERS //

app.emit = {

    register: function () {
        app.socket.emit('register', {
            user: app.data.user(),
            room: app.data.room()
        });
    },

    msg: function (text) {
        if (text.length < 2) {
            return false;
        }
        app.socket.emit('msg', {
            room: app.rooms.active,
            text: text
        });
    }

};
