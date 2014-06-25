/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Sockets | Aula
 * Romel Pérez, @prhonedev
 * 2014
 **/

var _ = require('underscore');
var mysql = require('../databases/mysql');
var acdb = require('../databases/aulachat');


// ------------------------------------------------------------------------- //
// APPLICATION //

var app = {

    // Todas las clases con sus usuarios activos
    classes: {

        // { 'class_group': { id1: {user1}, id2: {user2}, ... }, ... }
        cache: {},

        // Agregar usuario activo a clase, crear sino tiene usuarios activos
        // data: {id, socket, state, code, clase}
        addUser: function (data) {
            this.cache[data.clase] = this.cache[data.clase] || {};
            this.cache[data.clase][data.id] = {
                socket: data.socket,  // Socket id
                state: data.state,  // 'avail' | 'unavail'
                info: db.userByCode(data.code)  // User data
            };
        },

        // Remover un usuario de una clase por socket
        removeUser: function (socket) {
            _.each(this.cache, function (group, ind) {
                _.each(group, function (user, index) {
                    if (socket === user.socket) {
                        delete group[index];
                        return;
                    }
                });
            });
        },

        // Todos los usuarios de una clase, activos y offline
        users: function (clase, except) {
            var users = db.usersByClass(clase);

            // Remover usuario excepción de la lista
            _.each(users, function (el, i) {
                if (except === el.id) {
                    delete users[i];
                }
            });

            // Colocar estados a usuarios de lista
            _.each(users, function (user, id) {
                users[id] = {
                    id: id,
                    info: user
                };
                if (this.cache[clase][id]) {
                    users[id].state = this.cache[clase][id].state;
                } else {
                    users[id].state = 'offline';
                }
            }, this);

            // users: {info, state}
            return users;
        }

    },


    // Todas las salas personalizadas
    rooms: {

        // { id: {type, name, clase, users[ids]}, ... }
        cache: {},

        // Agregar una nueva sala personalizada
        // data: {type, name, clase, users[ids]}
        add: function (data) {
            var id = data.clase + '_' + (new Date()).getTime();
            this.cache[id] = {
                type: data.type,
                name: data.name,
                clase: data.clase,
                users: data.users
            };
            // Retornar el id de sala
            return id;
        },

        remove: function (id) {
            delete this.cache[id];
        },

        // Si un usuario se ha salido de una sala personalizada
        getout: function (id, userid) {
            this.cache[id].users = _.without(this.cache[id].users, userid);
            if (this.cache[id].users.length === 0) {
                this.remove(id);
            }
        }

    },


    // Eventos de Sockets
    events: {

        // Un usuario se vuelve online
        // data: {clase, id}
        online: function (data) {
            var io = this.io;
            var socket = this.socket;
            var info = db.userById(data.id);

            // Agregar a la lista de usuarios activos de una clase
            app.classes.addUser({
                id: data.id,
                socket: socket.id,
                state: 'avail',
                code: info.code,
                clase: data.clase
            });

            // Agregarlo a la sala
            socket.join(data.clase);

            // Comunicar que ya está online y enviarle datos
            socket.emit('onlined', {
                // Enviar todos los usuarios de la clase
                users: app.classes.users(data.clase, data.id),
                // Enviar las salas y sus mensajes a las que pertenece
                rooms: {}  // id: {name, type, users[ids], msgs: []}
            });

            // Comunicar a todos los demás usuarios conectados
            socket.broadcast.to(data.clase).emit('userOnline', data.id);
        },

        // Un usuario se vuelve offline
        offline: function () {
            var i, j, id, clase;
            var io = this.io;
            var socket = this.socket;

            // Encontrar id de usuario y clase por su socket
            for (i in app.classes.cache) {
                for (j in app.classes.cache[i]) {
                    if (socket.id === app.classes.cache[i][j].socket) {
                        id = j;
                        clase = i;
                        break;
                    }
                }
                if (id) {
                    break;
                }
            }

            // Remover de la lista de usuarios activos de la clase
            app.classes.removeUser(socket.id);

            // No es necesario enviar nada al usuario desconectado

            // Actualizar a todos los demás usuarios de la misma clase
            socket.broadcast.to(clase).emit('userOffline', id);
        },

        // Un usuario ha enviado un mensaje
        // data: {id, room, content, params}
        msg: function (data) {
            var io = this.io;
            var socket = this.socket;

            io.sockets['in'](data.room).emit('userMsged', data);
        },

        // Un usuario ha creado una nueva sala
        // data: {*id, type, name, clase, *users[ids]} // *id: id de usuario, *users: usuarios excepto él mismo
        roomNew: function (data) {
            var room, newData;
            var uSockets = [];
            var io = this.io;
            var socket = this.socket;

            data.users.unshift(data.id);  // Agregar él mismo a la lista
            room = app.rooms.add(data);  // Crear sala

            _.each(data.users, function (id, i) {
                if (app.classes.cache[data.clase] && app.classes.cache[data.clase][id]) {
                    // El usuario está activo ('avail' || 'unavail')
                    uSockets.push(app.classes.cache[data.clase][id].socket);
                }
            });

            // Enviar a cada usuario de la sala, incluyendolo a él mismo
            newData = {
                room: room,  // El nuevo identificador
                type: data.type,
                name: data.name,
                users: data.users
            };
            _.each(uSockets, function (sk, i) {
                io.sockets.socket(sk).join(room);
                io.sockets.socket(sk).emit('roomNewed', newData);
            });
        },

        // El usuario ha salido de una sala
        // data: {id, room}
        roomGetout: function (data) {
            var io = this.io;
            var socket = this.socket;

            // Si pertenece a una sala personalizada
            if (app.rooms.cache[data.room]) {
                app.rooms.getout(data.room, data.id);
                io.sockets['in'](data.room).emit('roomGotout', {
                    id: data.id,
                    room: data.room
                });
            }
        }

    }

};



// ------------------------------------------------------------------------- //
// EVENTS //

module.exports = function (io) {

    // Authorization
    io.of('/aulachat').authorization(function (handshake, connection) {

        var errors = null;
        var authorized = true;

        connection(errors, authorized);

    })

    // Connection
    .on('connection', function (socket) {

        var context = {io: io, socket: socket};

        // Usuario Online
        socket.on('online', function () {
            app.events.online.apply(context, arguments);
        });

        // Usuario Offline
        socket.on('offline', function () {
            app.events.offline.apply(context, arguments);
        });
        socket.on('disconnect', function () {
            app.events.offline.apply(context, arguments);
        });

        // Usuario Mensaje
        socket.on('msg', function () {
            app.events.msg.apply(context, arguments);
        });

        // Sala Nueva
        socket.on('roomNew', function () {
            app.events.roomNew.apply(context, arguments);
        });

        // Sala Usuario que ha Salido
        socket.on('roomGetout', function () {
            app.events.roomGetout.apply(context, arguments);
        });

    });

};
