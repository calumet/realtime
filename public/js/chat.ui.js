/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | User Interface
 * Romel Pérez, @prhonedev
 * Duvan Vargas, @DuvanJamid
 * Febrero del 2014
 **/

 var app = app || {};

// ------------------------------------------------------------------------- //
// WINDOW //

// Popup functions
app.popup = {

    wincon: 0,  // Check interval with creator window

    check: function () {
        app.popup.wincon = setInterval(function () {
            if (!window.opener) {
                clearInterval(app.popup.wincon);
                alert('La ventana del aula ha sido cerrada!', {
                    type: 'error',
                    success: function () {
                        window.close();
                    }
                });
            };
        }, 2000);
    }

};


// Window functions
app.tool = {

    // Make neat the interface
    win: function () {
        var dims = Elise.win.dims();

        // Restrictions
        dims.width = dims.width < 600 ? 600 : dims.width;
        dims.height = dims.height < 300 ? 300 : dims.height;

        // Width - Vertical Borders
        $('#main').css('width', dims.width);
        $('#users').css('width', dims.width * 0.18 - 1);
        $('#chat').css('width', dims.width * 0.64 - 2);
        $('#rooms').css('width', dims.width * 0.18 - 1);

        // Height - Lateral Borders
        $('#main').css('height', dims.height);
        $('#users, #chat, #rooms').css('height', dims.height - $('#header').height() - 2);
        $('#content-chat').css('height', dims.height - $('#header').height() - $('#chatTitle').height() - $('#toolbar').height() - 2);
        $('#usersList, #roomsList').css('height', $('#users').height() - $('#usersTitle').height());
    }

};


// Register DOM Events
app.dom = {

    init: function () {
        this.messages();
        this.rooms();
    },

    // When the user wants to send a message
    messages: function () {
        $('#toolbar').on('submit', function () {
            app.emit.msg($('#message').val());
            $('#message').val('').focus();
            return false;
        });
    },

    // Create a new chat between this user and others users
    rooms: function () {
        $('#roomCreate').on('click', function () {
            // Create new room
        });
    }

};


// ------------------------------------------------------------------------- //
// STATE //

app.state = {

    start: function () {
        var ud = app.data.user();
        $('#photo').attr('src', ud.photo);
        $('#user').html(ud.firstName + ' ' + ud.firstSurname + '<br>' + ud.level + ' - ' + ud.code);

        // Subject Info
        $('#subject').html(app.aula.data.subject + '<br>' + app.aula.data.teacher);

        // Show User Interface
        $('#loader').addClass('none');
        $('#main').removeClass('invisible');
    },

    set: function (data) {
        var classes = ['offline', 'unavail', 'avail'];
        var $photo = $('#photo');
        // Remove active class
        $.each(classes, function (i, v) {
            $photo.removeClass(classes[i]);
        });
        // Add actual class
        $photo.addClass(data);
    }

};


// ------------------------------------------------------------------------- //
// USERS //

app.users = {

    cache: {}, // Users Object-Array ::: id: { id, user: {code, room, state, user} }

    add: function (data) {
        // Register
        app.users.cache[data.id] = data;

        // Add to UI
        $('#usersList').append($('<div>', {
            id: 'u' + data.id,
            'class': 'user',
            html: '<img class="" src="' + data.user.photo + '">' + '<div class="avail">' + data.user.firstName + ' ' + data.user.firstSurname + '<br>' + data.user.level + '</dv>'
        }));

        // Show in UI
        $('#u' + data.id).fadeIn(250);
    },

    remove: function (id) {
        // Unregister
        delete app.users.remove[id];

        // Hide from UI and delete it
        $('#u' + id).fadeOut(250, function() {
            $(this).remove();
        });
    }

};


// ------------------------------------------------------------------------- //
// MESSAGES //

app.messages = {

    msgTemplate:_.template($('#msgTemplate').html()),

    receive: function(data) {

        var user_local = app.data.user();
        var user_remoto = app.users.cache[data.id] ? app.users.cache[data.id].user : app.data.user();

        // si su comentario fu el ultimo no crea bloque para mensaje
        if ($('#rc' + data.room).children('.block:last').find('.msg').hasClass(user_remoto.code)) {
            $('#rc' + data.room).children('.block:last').find('.content').append($('<p/>',{text:data.text}));
        } else {
            // crea el menssaje
            obj={};
            obj.user=user_remoto;
            obj.position=(user_local.code == user_remoto.code) ? 'pull-right' : 'pull-left';
            obj.theme=(user_local.code == user_remoto.code) ? 'cian' : 'orange';
            obj.msg=data;
            var html=app.messages.msgTemplate(obj);
            $('#rc' + data.room).append(html); // se agrega el mensaje en la sala correspondiente
        }

       //$('#rc' + data.room).parent('#content-chat').scrollTop( $('#rc' + data.room).height()); // mueve el scroll

       app.rooms.update(data.room);
   }

};


// ------------------------------------------------------------------------- //
// ROOMS //

app.rooms = {

    active: null,
    cache: {},

    // This function add the room chat in the DOM and make the functionalities
    add: function (data) {
        var i, name = '';

        // Add to list
        app.rooms.cache[data.id] = data.users;

        // Set Room Name
        if (data.type === 'general') {
            name = 'Chat General';
        } else if (data.type === 'custom') {
            if (data.users.length == 1) {
                name = data.users[0].name;
            } else {
                for (i = 0; i < data.users.length; i += 1) {
                    name += data.users[i].name.substring(0, data.users[i].name.indexOf(' ') + ', ');
                }
                name = name.substring(0, name.length - 2);
            }
        }

        // Create Chat Room
        $('#chatRoom').append($('<div>', {
            id: 'rc' + data.id,
            'class': 'chatRoom none'
        }));

        // Create List Item
        $('#roomsList').append(
            $('<div>', {
                id: 'rl' + data.id,
                'class': 'none',
                html: '<div>' + name + '</div><small>Leyendo</small>'
            }).on('click', function () {
                app.rooms.change(data.id);
            })
            );
        $('#rl' + data.id).fadeIn(250);

        // Activate Room
        app.rooms.change(data.id);
    },

    remove: function (id) {
        if (id === app.data.room()) {
            return;
        }
        $('#rl' + id + ', #rc' + id).fadeOut(250, function() {
            $(this).remove();
            app.rooms.change(app.data.room());
        });
    },

    update: function (id) {
        var $el = $('#rl' + id + ' small');

        // If the user is not reading this
        if (id !== app.rooms.active) {
            $el.html('<b>Mensajes nuevos</b>');
        } else {
            $el.html('Leyendo');
        }
    },

    change: function (id) {
        // Leave item active
        $('#rl' + app.rooms.active + ' small').html('No hay mensajes nuevos');

        // Change item active
        $('#roomsList > div').removeClass('active');
        $('#rl' + id).addClass('active');
        $('#rl' + id + ' small').html('Leyendo');

        // Change chat active
        $('.chatRoom').addClass('none');
        $('#rc' + id).removeClass('none');

        // Change room active
        app.rooms.active = id;
    }

};
