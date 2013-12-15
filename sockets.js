/*!
 * PRHONE Applications
 * Chat | Sockets
 * Romel Pérez, 2013
 **/

// socket.broadcast.to(data.room).emit('userSynced', socket.id);

// ------------------------------------------------------------------------- //
// PROCCESSES //

var app = {

	users: {
		cache: {},
		add: function (data) {
			this.cache[data.id] = {
				id: data.id,
				room: data.room,  // Main room
				user: {
					code: data.user.code,
					name: data.user.name,
					level: data.user.level,
					photo: data.user.photo
				}
			};
		},
		remove: function (id) {
			delete this.cache[id];
		},
		byRoom: function (room, except) {
			var o, users = {};
			for(o in app.users.cache){
				if(app.users.cache[o].room === room  &&  app.users.cache[o].id !== except){
					users[o] = app.users.cache[o];
				}
			}
			return users;
		}
	}

};


// ------------------------------------------------------------------------- //
// CHAT //

exports.listen = function (io) {
	
	io.sockets.on('connection', function (socket) {

		// READYRUN :: Connection
		socket.emit('connected');


		// ------------------------------------------------------------- //
		// REGISTER / UNREGISTER //
		
		// Register User
		socket.on('register', function (data) {
			// Add to list
			app.users.add({
				id: socket.id,
				room: data.room,
				user: {
					code: data.user.code,
					name: data.user.name,
					level: data.user.level,
					photo: data.user.photo
				}
			});

			// Add the general room
			socket.join(data.room);

			// Communicate registered state
			socket.emit('registered', {
				users: app.users.byRoom(data.room, socket.id)
			});

			// Communicate to all connected users
			socket.broadcast.to(data.room).emit('userRegistered', {
				id: socket.id,
				user: {
					code: data.user.code,
					name: data.user.name,
					level: data.user.level,
					photo: data.user.photo
				}
			});
		});


		// Unregister User
		var unregister = function () {
			// Remove from list
			app.users.remove(socket.id);
			
			// Update other users connected with this in all its rooms
			for(var r in io.sockets.manager.roomClients[socket.id]){
				if(r !== ''){
					io.sockets.in(r.replace('/','')).emit('userUnregistered', socket.id);
				}
			}
		};

		// Disconnection
		socket.on('unregister', unregister);
		socket.on('disconnect', unregister);



		// ------------------------------------------------------------- //
		// ROOMS //
		
		// Join Room
		//


		// Leave Room
		//



		// ------------------------------------------------------------- //
		// MESSAGES //
		
		// Message
		socket.on('msg', function (data) {
			io.sockets.in(data.room).emit('userMsged', {
				id: socket.id,
				room: data.room,
				text: data.text
			});
		});

	});

};
