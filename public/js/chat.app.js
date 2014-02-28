/*!
 * PRHONE Applications
 * Chat | Chat | App
 * Romel Pérez, 2013
 **/

var app = app || {};

// ------------------------------------------------------------------------- //
// CORE //

// Variables and configuration
app.socket = null;
app.config = {
    server: window.opener.app.config.server
};
app.data = window.opener.app.user;


// Initialization
app.init = function () {

    // Organize Interface
    app.tool.win();

    // Start check interval with main window
    app.popup.check();

    // Connect
    app.connect(function () {
        // Register User
        app.emit.register();

        // Charge general room
        app.rooms.add({
            type: 'general',
            id: app.data.room(),
            users: []
        });

        // Start
        app.main();
    });

    // Start UI Events Modules
    app.rooms.create();
    app.messages.send();
};


// Connection to server
app.connect = function (callback) {

    // Create connection with server
    var script = document.createElement('script');
    script.src = app.config.server + '/socket.io/socket.io.js';
    document.getElementsByTagName('body')[0].appendChild(script);

    // When the socket is charged
    script.onload = script.onreadystatechange = function () {
        app.socket = io.connect(app.config.server);
        callback();
    };

};


// ------------------------------------------------------------------------- //
// SOCKET EVENTS //

app.main = function () {

    // Connected
    app.socket.on('connected', function () {
        //
    });


    // Registered
    app.socket.on('registered', function (data) {
        var user;
        for (user in data.users) {
            app.users.add(data.users[user]);
        }
        app.state.set('avail');
        app.state.sync();
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
            return;
        }
        app.socket.emit('msg', {
            room: app.rooms.active,
            text: text
        });
    }

};


