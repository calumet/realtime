/*!
 * PRHONE Applications
 * Chat | Index | App
 * Romel Pérez, 2013
 **/

var DNS = 'http://192.168.1.18:3000';

// ------------------------------------------------------------------------- //
// MAIN //

var app = {

	socket: null,
	user: {},

	init: function () {
		app.tool.win();
		app.login();
	},


	login: function () {
		// Show login interface
		$('#login').modal({
			keyboard: false,
			backdrop: 'static'
		});

		$('#loginBtn').on('click', function () {
			// Charge user data
			var room = $('#room').val();
			app.user = {
				name: $('#name').val(),
				level: $('#level').val(),
				photo: $('#photoURL').val() !== '' ? $('#photoURL').val() : '/img/photos/'+ $('#photo').val(),
				room: room
			};

			// Charge general room
			app.rooms.add({
				id: room,
				name: 'General'
			});
			app.rooms.change(room);

			// Start connection
			app.socket = io.connect(DNS);
			app.main();

			// Show interface
			$('#main').fadeIn(500);
		});
	},


	main: function () {

		// READYRUN :: Register
		app.socket.emit('register', app.user);


		// ------------------------------------------------------------- //
		// Incoming Events //
		
		// Connection
		app.socket.on('connected', function (data) {
			data.room = app.user.room;
			app.messages.receive(data);
		});


		// Sync user
		app.socket.on('sync', function (data, msg) {
			app.user.id = data.id;
			app.user.color = data.color;
			msg.room = app.user.room;
			app.messages.receive(msg);
		});


		// A new user registered
		app.socket.on('register', function (data) {
			app.users.add(data);
		});


		// A user unregistered
		app.socket.on('unregister', function (data) {
			app.users.remove(data.id);
		});


		// On another user message
		app.socket.on('message', function (data) {
			app.messages.receive(data);
		});



		// ------------------------------------------------------------- //
		// Sending Events //

		// Message
		app.messages.send(function (text) {
			app.socket.emit('message', {
				id: app.user.id,
				room: app.rooms.active,
				text: text
			});
		});

	},


	users: {

		cache: {},  // All users list
		
		add: function (data) {
			app.users.cache[data.id] = data;
			$('#usersList').append($('<div>', {
				id: 'u'+ data.id,
				'class': 'none',
				html: '<img src="'+ data.photo +'">'
					 +'<div>'+ data.name +'<br>'+ data.level +'</dv>',
			 	click: function () {
			 		app.rooms.create(data.id);
			 	}
			}));
			$('#u'+ data.id).fadeIn(250);
		},

		remove: function (id) {
			delete app.users.remove[id];
			$('#u'+ id).fadeOut(250, function () {
				$(this).remove();
			});
		}

	},


	rooms: {

		active: null,
		cache: [],

		// This function create a new chat between this user and other user picked
		create: function (data) {
			//
		},

		// This function add the room chat in the DOM and make the functionalities
		add: function (data) {
			// Add to list
			app.rooms.cache.push(data.id);

			// Create Chat Room
			$('#chatRoom').append($('<div>', {
				id: 'rc'+ data.id,
				'class': 'chatRoom none'
			}));

			// Create List Item
			$('#roomsList').append($('<div>', {
				id: 'rl'+ data.id,
				'class': 'none',
				html: '<div>'+ data.name +'</div><small>Empty</small>'
			}))
			.on('click', function () {
				app.rooms.change({
					id: data.id
				});
			});
			$('#rl'+ data.id).fadeIn(250);
		},

		remove: function (id) {
			app.rooms.change(app.user.room);
			$('#rl'+ id +', #rc'+ id).fadeOut(250, function(){
				$(this).remove();
			});
		},

		update: function (id, users) {
			var $el = $('#rl'+ id);
			var newNames = '';

			// If the user is not reading this
			if(app.rooms.active !== id){
				$el.find('small').html('<b>New messages</b>');
			}

			// If there are more users in the room
			if(users){
				for(var u in users)
					newNames += u.substring(0, u.indexOf(' ')) +', ';
				newNames = newNames.substring(0, newNames.length - 2);
				$el.find('div').html(newNames).attr('title', newNames);
			}
		},

		change: function (id) {
			// Change item active
			$('#roomsList > div').removeClass('active');
			$('#rl'+ id).addClass('active');
			$('#rl'+ id +' small').html('<b>Reading</b>');

			// Change chat active
			$('.chatRoom').addClass('none');
			$('#rc'+ id).removeClass('none');
			
			// Change room active
			app.rooms.active = id;
		}

	},


	messages: {

		receive: function (data) {
			var $l = $('<div><b style="color:'+ data.color +'">'+ data.name +'</b>: '+ data.text +'</div>');
			$('#rc'+ data.room).append($l)[0].scrollTop += $l.height() + 100;
			app.rooms.update(data.room);
		},

		send: function (fn) {
			$('#toolbar').on('submit', function () {
				fn($('#toolbar input').val());
				$('#toolbar input').val('').focus();
				return false;
			});
		}

	},


	tool: {

		// Make neat the interface
		win: function () {
			var dims = app.tool.dims();

			// Width
			$('#main').css('width', dims.width);
			$('#users').css('width', dims.width*0.18);
			$('#chat').css('width', dims.width*0.64 - 1);
			$('#rooms').css('width', dims.width*0.18 - 1);

			// Height
			$('#main, #users, #chat, #rooms').css('height', dims.height);
			$('#chatRoom').css('height', dims.height - $('#chatTitle').height() - $('#toolbar').height());
		},

		// Calculate the window content dimensions
		dims: function () {
			var dim = { width: 0, height: 0 };
			if(typeof window.innerWidth != "undefined"){
				dim.width = window.innerWidth;
				dim.height = window.innerHeight;
			}else if(typeof document.documentElement != "undefined" && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0){
				dim.width = document.documentElement.clientWidth;
				dim.height = document.documentElement.clientHeight;
			}else{
				dim.width = document.getElementsByTagName("body")[0].clientWidth;
				dim.height = document.getElementsByTagName("body")[0].clientHeight;
			}
			return dim;
		}

	}

};


// ------------------------------------------------------------------------- //
// INITIALIZATION //

jQuery(document).ready(app.init);
jQuery(window).resize(app.tool.win);
