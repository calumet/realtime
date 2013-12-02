/*!
 * PRHONE Applications
 * Chat | Sockets
 * Romel Pérez, 2013
 **/

// ------------------------------------------------------------------------- //
// PROCCESSES //

var app = {

	users: {
		cache: {},
		add: function(data){
			this.cache[data.id] = {
				id: data.id,
				name: data.name,
				level: data.level,
				photo: data.photo,
				color: app.color.get()
			};
		},
		remove: function(id){
			delete this.cache[id];
		}
	},

	color: {

		colors: [ 'gray', 'brown', 'blue', 'red', 'purple', 'violet', 'green', 'yellow', 'cyan', 'orange' ],
		get: function(){
			var color = this.colors.pop();
			return color ? color : 'black';
		}	

	}

};


// ------------------------------------------------------------------------- //
// CHAT //

exports.listen = function (io) {
	
	io.sockets.on('connection', function (socket) {

		// READYRUN :: Connection
		socket.emit('connected', {
			id: 'server',
			room: 'General',
			name: 'Server',
			text: 'Connected. Loading data...',
			color: 'gray'
		});


		// ------------------------------------------------------------- //
		// REGISTER / UNREGISTER //
		
		// Register User
		socket.on('register', function (data) {
			// Add to list
			app.users.add({
				id: socket.id,
				name: data.name,
				level: data.level,
				photo: data.photo,
				room: data.room
			});

			// Sync with this
			socket.emit('sync',
				{   // Send user data
					id: socket.id,
					color: app.users.cache[socket.id].color
				},
				{   // Message
					id: 'server',
					room: 'General',
					name: 'Server',
					text: 'Data loaded!',
					color: 'gray'
				}
			);

			// Add the general room
			socket.join(data.room);

			// Update others users in general room
			socket.broadcast.to(data.room).emit('register', app.users.cache[socket.id]);
		});

		// Unregister User
		var unregister = function (data) {
			// Remove from list
			app.users.remove(socket.id);
			
			// Update other users connected with this in all its rooms
			for(var r in io.sockets.manager.roomClients[socket.id])
				io.sockets.in(r.replace('/','')).emit('unregister', socket.id);
		};
		socket.on('unregister', unregister);  // THIS IS NOT USED, YET //


		// Disconnection
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
		socket.on('message', function (data) {
			var user = app.users.cache[data.id];
			user.text = data.text;
			user.room = data.room;
			io.sockets.in(data.room).emit('message', user);
		});

	});

};
