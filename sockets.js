/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | Server Application
 * Romel Pérez, @prhonedev
 * Febrero del 2014
 **/

var _ = require('underscore');
var db = require('./database.js');

// ------------------------------------------------------------------------- //
// APPLICATION //

var app = {

    // All classes within active users
    classes: {

        // { 'class_group': { id1: {user1}, id2: {user2}, ... }, ... }
        cache: {},

        // Add user to a class
        // data: {id, socket, state, code, clase}
        addUser: function (data) {
            this.cache[data.clase] = this.cache[data.clase] || {};
            this.cache[data.clase][data.id] = {
                socket: data.socket,  // Socket id
                state: data.state,  // 'avail' | 'unavail'
                info: db.userByCode(data.code)  // User data
            };
        },

        // Remove an user from a class
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

        // All users by class and parse the avails/unavails
        users: function (clase, except) {
            var users = db.usersByClass(clase);

            // Remove user exception
            _.each(users, function (el, i) {
                if (except === el.id) {
                    delete users[i];
                }
            });

            // Parse states by students
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


    // All class and custom rooms
    rooms: {

        // { id: {type, name, clase, users[ids]}, ... }
        cache: {},

        // Add a new room
        // data: {type, name, clase, users[ids]}
        add: function (data) {
            var id = data.clase + '_' + (new Date()).getTime();
            this.cache[id] = {
                type: data.type,
                name: data.name,
                clase: data.clase,
                users: data.users
            };
            // Return the room id
            return id;
        },

        remove: function (id) {
            delete this.cache[id];
        },

        // If a user got out from a custom room
        getout: function (id, userid) {
            this.cache[id].users = _.without(this.cache[id].users, userid);
            if (this.cache[id].users.length === 0) {
                this.remove(id);
            }
        }

    },


    // Sockets events functions
    events: {

        // The user becomes online
        // data: {clase, id}
        online: function (data) {
            var io = this.io;
            var socket = this.socket;
            var info = db.userById(data.id);

            // Add to online class users cache
            app.classes.addUser({
                id: data.id,
                socket: socket.id,
                state: 'avail',
                code: info.code,
                clase: data.clase
            });

            // Add to its class room
            socket.join(data.clase);

            // Communicate registered state
            socket.emit('onlined', {
                // Send all connected classmates, except itself
                users: app.classes.users(data.clase, data.id)
            });

            // Communicate to all connected students
            socket.broadcast.to(data.clase).emit('userOnline', data.id);
        },

        // The user becomes offline
        offline: function () {
            var i, j, room, id;
            var io = this.io;
            var socket = this.socket;

            // Find user id by socket id
            for (i in app.classes.cache) {
                for (j in app.classes.cache[i]) {
                    if (socket.id === app.classes.cache[i][j].socket) {
                        id = j;
                        break;
                    }
                }
                if (id) {
                    break;
                }
            }

            // Remove from online class users cache
            app.classes.removeUser(socket.id);

            // It's not neccessary to send anything to itself

            // Update other students connected with this in all its rooms
            for (room in io.sockets.manager.roomClients[socket.id]) {
                if (room !== '') {
                    // Send the user id
                    io.sockets['in'](room.replace('/', '')).emit('userOffline', id);
                }
            }
        },

        // The user has sent a message
        // data: {id, room, content, params}
        msg: function (data) {
            var io = this.io;
            var socket = this.socket;

            io.sockets['in'](data.room).emit('userMsged', data);
        },

        // The user has created a new room
        // data: {*id, type, name, clase, *users[ids]} // *id: user id, *users: except itself
        roomNew: function (data) {
            var room, newData;
            var uSockets = [];
            var io = this.io;
            var socket = this.socket;

            data.users.unshift(data.id);  // Add itself to list
            room = app.rooms.add(data);  // Create room

            _.each(data.users, function (id, i) {
                if (app.classes.cache[data.clase] && app.classes.cache[data.clase][id]) {
                    // The user is connected ('avail' || 'unavail')
                    uSockets.push(app.classes.cache[data.clase][id].socket);
                }
            });

            // Send to every user in room, including itself
            newData = {
                room: room,  // The new room id
                type: data.type,
                name: data.name,
                users: data.users
            };
            _.each(uSockets, function (sk, i) {
                io.sockets.socket(sk).join(room);
                io.sockets.socket(sk).emit('roomNewed', newData);
            });
        },

        // The user has got out from a room
        // data: {id, room}
        roomGetout: function (data) {
            var io = this.io;
            var socket = this.socket;

            app.rooms.getout(data.room, data.id);
            io.sockets['in'](data.room).emit('roomGotout', {
                id: data.id,
                room: data.room
            });
        }

    }

};


// ------------------------------------------------------------------------- //
// EVENTS //

exports.listen = function (io) {

    io.sockets.on('connection', function (socket) {

        // CONNECTED
        socket.emit('connected');


        var context = {
            io: io,
            socket: socket
        };

        // User Online
        socket.on('online', function () { app.events.online.apply(context, arguments); });

        // User Offline
        socket.on('offline', function () { app.events.offline.apply(context, arguments); });
        socket.on('disconnect', function () { app.events.offline.apply(context, arguments); });

        // User Message
        socket.on('msg', function () { app.events.msg.apply(context, arguments); });

        // Room New
        socket.on('roomNew', function () { app.events.roomNew.apply(context, arguments); });

        // Room Get Out
        socket.on('roomGetout', function () { app.events.roomGetout.apply(context, arguments); });

    });

};

/* // NOTES //
How to emit messages in socket.io:
https://github.com/LearnBoost/socket.io/wiki/How-do-I-send-a-response-to-all-clients-except-sender%3F
*/
