/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | Client Application
 * Romel Pérez, @prhonedev
 * Duvan Vargas, @DuvanJamid
 * Marzo del 2014
 **/

var app = app || {};

// ------------------------------------------------------------------------- //
// CORE //

// Variables and configuration
app.socket = null;
app.data = window.opener.app.chat.user;
app.server = window.opener.app.chat.server;
app.variables = {
    // Users Categories
    categories: {
        'CT1': 'Docente',
        'CT2': 'Estudiante'
    }
};


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
        app.events.init();

        // Register user on server
        app.emit.online();

        // Charge general clase
        app.rooms.add({
            id: app.data.clase(),
            type: 'general'
        });
    });

};


// Connection to server
app.connect = function (started) {

    // Create connection with server
    var script = document.createElement('script');
    script.src = app.server + '/socket.io/socket.io.js';
    document.getElementsByTagName('body')[0].appendChild(script);

    // When the socket is charged
    script.onload = script.onreadystatechange = function () {
        app.socket = io.connect(app.server);
        started();
    };

};


// ------------------------------------------------------------------------- //
// SOCKET EVENTS //

app.events = {

    init: function () {

        app.socket.on('connected', this.mine.connected);
        app.socket.on('onlined', this.mine.onlined);

        app.socket.on('userOnline', this.others.user.online);
        app.socket.on('userOffline', this.others.user.offline);
        app.socket.on('userMsged', this.others.user.msged);

        app.socket.on('roomNewed', this.others.room.newed);
        app.socket.on('roomGotout', this.others.room.gotout);

    },

    mine: {

        // I am now connected
        connected: function () {
            console.debug('>>> Connected to server');
        },

        // data: {users: {id1, id2, ...}}
        onlined: function (data) {
            console.debug('>>> Online in server');

            // Add all others users
            _.each(data.users, function (user, id) {
                app.users.add(user);
            });

            // Set interface
            app.state.start();
            app.state.set('avail');

            // Activate Room Events
            app.dom.rooms.main();
        }

    },

    others: {

        user: {

            // id: user id
            online: function (id) {
                app.users.online(id);
            },

            // id: user id
            offline: function (id) {
                app.users.offline(id);
            },

            // data: {id, room, content, params}
            msged: function (data) {
                console.debug('A new message from ' + data.id);
                app.messages.receive(data);
            }

        },

        room: {

            // data: {room, type, name, users[ids]}
            newed: function (data) {
                app.rooms.add({
                    id: data.room,
                    type: data.type,
                    name: data.name,
                    users: data.users
                });
            },

            // data: {room, id}
            gotout: function (data) {
                app.rooms.getout({
                    room: data.room,
                    id: data.id
                });
            }

        }

    }

};


// ------------------------------------------------------------------------- //
// SOCKET TRIGGERS //

app.emit = {

    online: function () {
        app.socket.emit('online', {
            clase: app.data.clase(),
            id: app.data.user().id
        });
    },

    // data: {content, params}
    msg: function (data) {
        if (data.content.length < 2) {
            return false;
        }
        data.params = data.params ? data.params : {};
        app.socket.emit('msg', {
            id: app.data.user().id,
            room: app.rooms.active,
            content: data.content,
            params: data.params
        });
    },

    // data: {type, name, users[ids]}
    newRoom: function (data) {
        app.socket.emit('roomNew', {
            id: app.data.user().id,
            clase: app.data.clase(),
            type: data.type,
            name: data.name,
            users: data.users
        });
    },

    getout: function (room) {
        app.socket.emit('roomGetout', {
            id: app.data.user().id,
            room: room
        });
    }

};
