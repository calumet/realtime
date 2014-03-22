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

// Variables y configuración
app.socket = null;
app.data = window.opener.app.chat.user;
app.server = window.opener.app.chat.server;
app.state = {
    focus: true,
    ready: false
};
app.variables = {
    // Categorías de usuarios
    categories: {
        'CT1': 'Docente',
        'CT2': 'Estudiante'
    }
};


// Inicialización
app.init = function () {

    // Estructurar aplicación
    app.tool.win();

    // Chequeo con la ventana del aula
    app.popup.check();

    // Registrar eventos al DOM
    app.dom.init();

    // Conectar con servidor
    app.connect(function () {
        // Eventos de socket
        app.events.init();

        // Registrar usuario como online en el servidor
        app.emit.online();

        // Cargar sala de clase
        app.rooms.add({
            id: app.data.clase(),
            type: 'general'
        });
    });

};


// Conexión con el servidor
app.connect = function (started) {

    // Crear conexión con el servidor
    var script = document.createElement('script');
    script.src = app.server + '/socket.io/socket.io.js';
    document.getElementsByTagName('body')[0].appendChild(script);

    // Cuando la conexión esté cargada
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

        app.socket.on('disconnect', this.server.failed);
        app.socket.on('connect_failed', this.server.failed);
        app.socket.on('reconnect', this.server.reconnect);

    },

    mine: {

        // Éste usuario ahora está conectado
        connected: function () {
            console.debug('>>> Conectado con el servidor.');
        },

        // data: {users: {id1, id2, ...}}
        onlined: function (data) {
            console.debug('>>> Usuario online en el servidor.');

            // Agregar todos los usuarios de la clase
            _.each(data.users, function (user, id) {
                app.users.add(user);
            });

            // Agregar todas las salas de éste usuario y sus mensajes
            //

            // Configurar interfaz de usuario
            app.user.start();
            app.user.set('avail');

            // Activar eventos del DOM de salas
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

    },

    server: {

        failed: function () {
            alert('El servidor se está reiniciando. Reconectando...');
        },

        reconnect: function () {
            setTimeout(function () {
                window.location.reload();
            }, 1000);
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
