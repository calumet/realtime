/*!
 * PRHONE Applications
 * Chat | Chat | App
 * Romel Pérez, 2013
 **/

// ------------------------------------------------------------------------- //
// MAIN //

var app = {

    DNS: 'http://192.168.1.18:3000',
    socket: null,
    data: {},
	wincon: 0,  // Check interval with creator window


	init: function () {
        // Connect
        app.socket = io.connect(app.DNS);

		// Organize Interface
		app.tool.win();

		// Start check interval with main window
		app.popupConnection();

		// Sync user data
		app.sync();  // Next : app.emit.register, Next : app.main

		// Start UI Events Modules
		app.rooms.create();
		app.messages.send();
	},


	popupConnection: function () {
		app.wincon = setInterval(function(){
			if (!window.opener) {
				clearInterval(app.wincon);
				alert('La ventana del aula ha sido cerrada!', {
					type: 'error',
					success: function () {
						window.close();
					}
				});
			};
		}, 2000);
	},


	// Require "data" global variable wrote by JSP
	sync: function () {
        app.data = function () {
            // Private
            var user;
            var room;

            $.ajax({
                type: 'POST',
                url: app.DNS + '/getUserData',
                data: {
                    code: data.code,
                    room: data.room
                },
                success: function (data) {
                    user = data.user;
                    room = data.room;

                    // Register User
                    app.emit.register();

					// Charge general room
					app.rooms.add({
						type: 'general',
						id: data.room,
						users: []
					});

                    // Start Socket Sync
                    app.main();
                }
            });

            // Public
            return {
                user: function () { return user },  // { code, name, level, photo }
                room: function () { return room }  // string
            };
        }();
	},


	main: function () {

		// Connected
		app.socket.on('connected', function () {});


		// Registered
		app.socket.on('registered', function (data) {
			var user;
			for(user in data.users){
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

	},


	emit: {

		register: function () {
			app.socket.emit('register', {
				user: app.data.user(),
				room: app.data.room()
			});
		},

		msg: function (text) {
			if(text.length < 2) return;
			app.socket.emit('msg', {
				room: app.rooms.active,
				text: text
			});
		}

	},


    state: {

    	sync: function () {
    		var ud = app.data.user();
			$('#photo').attr('src', ud.photo);
			$('#user').html(ud.name +'<br>'+ ud.level +' - '+ ud.code);
    	},

        set: function (data) {
            var classes = ['offline', 'unavail', 'avail'];
            var $photo = $('#photo');
            $.each(classes, function (i, v) {
                $photo.removeClass(classes[i]);
            });
            $photo.addClass(data);
        }

    },


	users: {

		cache: {},  // Users Object-Array ::: id: { id, user: {code, room, state, user} }
		
		add: function (data) {
			// Register
			app.users.cache[data.id] = data;
			
			// Add to UI
			$('#usersList').append($('<div>', {
				id: 'u'+ data.id,
				'class': 'none',
				html: '<img class="avail" src="'+ data.user.photo +'">'
					 +'<div>'+ data.user.name +'<br>'+ data.user.level +'</dv>'
			}));

			// Show in UI
			$('#u'+ data.id).fadeIn(250);
		},

		remove: function (id) {
			// Unregister
			delete app.users.remove[id];
			
			// Hide from UI and delete it
			$('#u'+ id).fadeOut(250, function () {
				$(this).remove();
			});
		}

	},


	rooms: {

		active: null,
		cache: {},

		// This function create a new chat between this user and other user picked
		create: function (data) {
			$('#roomCreate').on('click', function(){
				//
			});
		},

		// This function add the room chat in the DOM and make the functionalities
		add: function (data) {
			var i, name = '';

			// Add to list
			app.rooms.cache[data.id] = data.users;

			// Set Room Name
			if(data.type === 'general'){
				name = 'Chat General';
			}else if(data.type === 'custom'){
				if(data.users.length == 1){
					name = data.users[0].name;
				}else{
					for(i=0; i<data.users.length; i++){
						name += data.users[i].name.substring(0, data.users[i].name.indexOf(' ') + ', ');
					}
					name = name.substring(0, name.length-2);
				}
			}

			// Create Chat Room
			$('#chatRoom').append($('<div>', {
				id: 'rc'+ data.id,
				'class': 'chatRoom none'
			}));

			// Create List Item
			$('#roomsList').append(
				$('<div>', {
					id: 'rl'+ data.id,
					'class': 'none',
					html: '<div>'+ name +'</div><small>Leyendo</small>'
				}).on('click', function () {
					app.rooms.change(data.id);
				})
			);
			$('#rl'+ data.id).fadeIn(250);

			// Activate Room
			app.rooms.change(data.id);
		},

		remove: function (id) {
			if(id === app.data.room()){
				return;
			}
			$('#rl'+ id +', #rc'+ id).fadeOut(250, function(){
				$(this).remove();
				app.rooms.change(app.data.room());
			});
		},

		update: function (id) {
			var $el = $('#rl'+ id +' small');

			// If the user is not reading this
			if(id !== app.rooms.active){
				$el.html('<b>Mensajes nuevos</b>');
			}else{
				$el.html('Leyendo');
			}
		},

		change: function (id) {
			// Leave item active
			$('#rl'+ app.rooms.active +' small').html('No hay mensajes nuevos');

			// Change item active
			$('#roomsList > div').removeClass('active');
			$('#rl'+ id).addClass('active');
			$('#rl'+ id +' small').html('Leyendo');

			// Change chat active
			$('.chatRoom').addClass('none');
			$('#rc'+ id).removeClass('none');
			
			// Change room active
			app.rooms.active = id;
		}

	},


	messages: {

		receive: function (data) {
			var name = app.users.cache[data.id] ? app.users.cache[data.id].user.name : app.data.user().name;
			var $l = $('<div><b>'+ name +'</b>: '+ data.text +'</div>');
			$('#rc'+ data.room).append($l)[0].scrollTop += $l.height() + 100;
			app.rooms.update(data.room);
		},

		send: function () {
			$('#toolbar').on('submit', function () {
				app.emit.msg($('#message').val());
				$('#message').val('').focus();
				return false;
			});
		}

	},


	tool: {

		// Make neat the interface
		win: function () {
			var dims = Elise.win.dims();

			// Width - Vertical Borders
			$('#main').css('width', dims.width);
			$('#users').css('width', dims.width*0.18 - 1);
			$('#chat').css('width', dims.width*0.64 - 2);
			$('#rooms').css('width', dims.width*0.18 - 1);

			// Height - Lateral Borders
			$('#main').css('height', dims.height);
			$('#users, #chat, #rooms').css('height', dims.height - $('#header').height() - 2);
			$('#chatRoom').css('height', dims.height - $('#header').height() - $('#chatTitle').height() - $('#toolbar').height() - 2);
			$('#usersList, #roomsList').css('height', $('#users').height() - $('#usersTitle').height());
		}

	}

};


// ------------------------------------------------------------------------- //
// INITIALIZATION //

jQuery(document).ready(app.init);
jQuery(window).resize(app.tool.win);
