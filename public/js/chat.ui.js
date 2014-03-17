/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | User Interface
 * Romel Pérez, @prhonedev
 * Duvan Vargas, @DuvanJamid
 * Marzo del 2014
 **/

var app = app || {};

// ------------------------------------------------------------------------- //
// WINDOW //

// Popup functions
app.popup = {

    wincon: 0,  // Check interval with creator window

    check: function () {
        app.popup.wincon = setInterval(function () {
            if (!window.opener && !window.opener.app && !window.opener.app.chat) {
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
        $('#users').css('width', dims.width * 0.18 );
        $('#chat').css('width', dims.width * 0.64 - 50);
        $('#rooms').css('width', dims.width * 0.18 );

        // Height - Lateral Borders
        $('#main').css('height', dims.height);
        $('#users, #rooms').css('height', dims.height - $('#header').height() -2);
        $('#chat').css('height', dims.height - $('#header').height() - 50);
        $('#content-chat').css('height', dims.height - $('#header').height() - $('#chatTitle').height() - $('.toolbar').height() - 54);
        $('#usersList, #roomsList').css('height', $('#users').height() - $('#usersTitle').height());
    }

};


// Register DOM Events
app.dom = {

    init: function () {
        this.messages();
        this.files();
    },

    // When the user wants to send a message
    messages: function () {
        $('#toolbar').on('submit', function () {
            app.emit.msg({
                content: $('#message').val()
            });
            $('#message').val('').focus();
            return false;
        });
    },

    // Create a new chat between this user and others users
    rooms: {

        newRoomModal: null,

        main: function () {

            // Launch Room
            var launchRoom = function (e) {
                var $name = $('#createRoomName');
                var $users = $('#createRoomUsers');

                // Validations
                if ($name.val().length < 10) {
                    alert('El nombre de la sala debe ser de al menos 10 carácteres.', {type: 'error'});
                    return;
                } else if($users.val() === null) {
                    alert('Debes seleccionar al menos otro usuario.', {type: 'error'});
                    return;
                }

                // Create room
                app.emit.newRoom({
                    type: 'custom',
                    name: $name.val(),
                    users: $users.val()
                });

                // Hide eModal
                this.hide();
            };

            // Activate modal window
            $('#roomsCreate').on('click', function () {

                // Parse users select
                var users = '<option value=""></option>';
                _.each(app.users.cache, function (user, id) {
                    if (user.state !== 'offline') {
                        users += '<option value="' + id + '">' + user.info.firstName + ' ' + user.info.firstSurname +'</option>';
                    }
                });
                $('#createRoomUsers').html(users).select2({
                    placeholder: 'Selecciona...',
                    width: 270,
                    maximumSelectionSize: 10
                });

                // Create modal window
                if (app.dom.rooms.newRoomModal) {
                    app.dom.rooms.newRoomModal.show();
                } else {
                    app.dom.rooms.newRoomModal = eModal({
                        container: 'createRoomModal',
                        title: 'Crear Nueva Sala de Chat',
                        emodalWidth: 400,
                        emodalContentHeight: 200,
                        buttons: [{
                            btnText: 'Crear',
                            btnColor: 'azul',
                            btnPosition: 'right',
                            btnClick: launchRoom
                        }, {
                            btnClass: "emodal_hide",
                            btnText: "Cerrar",
                            btnColor: "rojo",
                            btnPosition: "left"
                        }]
                    });
                }
            });

        }

    },

    // Load utility files
    files: function () {
        
        // Sounds
        var createSoundFile = function (source) {
            var audio = document.createElement("audio");
            var sourceMP3 = document.createElement("source");
            var sourceOGG = document.createElement("source");
            sourceMP3.src = '/sound/' + source + '.mp3';
            sourceOGG.src = '/sound/' + source + '.ogg';
            audio.appendChild(sourceMP3, sourceOGG);
            return audio;
        };
        app.notify.audios = {
            msg: createSoundFile('CyanPing'),
            user: createSoundFile('Lalande'),
            room: createSoundFile('Heaven')
        };

    }

};


// ------------------------------------------------------------------------- //
// NOTIFICATIONS //

app.notify = {

    audios: {
        msg: undefined,
        user: undefined,
        room: undefined
    },

    _play: function (sound) {
        if (sound && Elise.val.number(sound.currentTime)) {
            sound.currentTime = 0;
            sound.play();
        }
    },

    // A new message has arrived
    msg: function () {
        this._play(this.audios.msg);
    },

    // A new user has been connected
    user: function () {
        this._play(this.audios.user);
    },

    // A new room has been created with me
    room: function () {
        this._play(this.audios.room);
    }

};


// ------------------------------------------------------------------------- //
// STATE //

app.state = {

    start: function () {
        var user = app.data.user();

        // User Info
        $('#photo').attr('src', user.photo);
        $('#user').html(
            user.firstName + ' ' + user.secondName + ' ' + user.firstSurname + ' ' + user.secondSurname
            + '<br>' + app.variables.categories[user.category] + ' - ' + user.code
        );

        // Subject Info
        $('#subject').html(window.opener.app.data.subject + '<br>' + window.opener.app.data.teacher);

        // Show User Interface
        $('#loader').addClass('none');
        $('#main').removeClass('invisible');

        // Window title
        window.document.title = 'Chat - ' + user.firstName + ' ' + user.firstSurname;
    },

    set: function (state, id) {
        var i, $user, $state;
        var classes = ['offline', 'unavail', 'avail'];
        var $temp = $('#usersList > div.user.isconnected:last');

        if (id) {
            $user = $('#u' + id);
            $state = $('#u' + id + ' > div');
            // Classify user
            if(state === 'offline') {
                $user.removeClass('isconnected');
            } else {
                $user.addClass('isconnected');
            }
            // Move user
            if ($temp.length === 0) {
                $('#usersList').prepend($user);
            } else {
                $temp.after($user);
            }
        } else {
            $state = $('#photo');
        }

        // Remove active class
        for (i = 0; i < classes.length; i += 1) {
            $state.removeClass(classes[i]);
        }
        // Add actual classes
        $state.addClass(state);
    }

};


// ------------------------------------------------------------------------- //
// USERS //

app.users = {

    // { id: {state, info}, ... }
    cache: {},

    // data: {id, state, info}
    add: function (data) {
        var name = data.info.firstName + ' ' + data.info.firstSurname;

        // Add to Cache
        this.cache[data.id] = {
            state: data.state,
            info: data.info
        };

        // Add to UI
        $('#usersList').append(
            $('<div>', {
                'id': 'u' + data.id,
                'class': 'user',
                'html': '<img class="" src="' + data.info.photo + '">'
                      + '<div class="">' + name
                      + '<br>' + app.variables.categories[data.info.category] + '</dv>'
            })
        );

        // Set user state
        app.state.set(data.state, data.id);
        // Notify
        app.notify.user();
    },

    online: function (id) {
        this.cache[id].state = 'avail';
        app.state.set('avail', id);
    },

    offline: function (id) {
        this.cache[id].state = 'offline';
        app.state.set('offline', id);
    }

};


// ------------------------------------------------------------------------- //
// MESSAGES //

app.messages = {

    msgTemplate: _.template($('#msgTemplate').html()),

    // data: {id, room, content, params}
    receive: function (data) {
        var ago, html;
        var fmt = function (time) {
            if (String(time).length == 1) {
                return '0' + time;
            } else {
                return String(time);
            }
        };

        var user_local = app.data.user();
        var user_remoto = app.users.cache[data.id] ? app.users.cache[data.id].info : app.data.user();

        var curTime = new Date();
        var hour = curTime.getHours() > 12 ? curTime.getHours() - 12 : (curTime.getHours() < 10 ? "0" + curTime.getHours() : curTime.getHours());
        var curMinute = fmt(curTime.getMinutes());

        var lastMsg = $('#rc' + data.room).children('.block:last');

        if (lastMsg.find('.msg').hasClass(user_remoto.id) &&
            lastMsg.find('.msg').hasClass(hour + '_' + curMinute)) {

            // Si su comentario fue el ultimo no crea bloque para mensaje
            lastMsg.find('.content').append($('<p/>', {text: data.content}));

        } else {

            // Sino, crea el menssaje
            ago = curTime.getFullYear() + '-' + fmt(curTime.getMonth() + 1) + '-' + fmt(curTime.getDate())
                        + 'T' + fmt(curTime.getHours()) + ':' + fmt(curTime.getMinutes()) + ':' + fmt(curTime.getSeconds());
            html = $(this.msgTemplate({
                user: user_remoto,
                position: user_local.id === user_remoto.id ? 'pull-right' : 'pull-left',
                theme: user_local.id === user_remoto.id ? 'cian' : 'orange',
                content: data.content,
                ago: ago,
                time: hour + ':' + curMinute
            }));
            html.find('.time').timeago();

            // Se agrega el mensaje en la sala correspondiente
            $('#rc' + data.room).append(html);

        }

        if(user_local.id !== user_remoto.id){
            app.notify.msg();  // Hace notificación
        }
        $('#content-chat').scrollTop($('#rc' + data.room).height()); // Mueve el scroll
        app.rooms.update(data.room);
   }

};


// ------------------------------------------------------------------------- //
// ROOMS //

app.rooms = {

    // Active chat room
    active: null,
    // { id: {name, type, users}, ... }
    cache: {},

    // data: {id, name, type, users[ids]}
    add: function (data) {
        var i, name = '';

        // Add to list
        app.rooms.cache[data.id] = {
            name: data.name,
            type: data.type,
            users: data.users
        };

        // Set Room Name
        if (data.type === 'general') {
            name = 'Chat General';
        } else if (data.type === 'custom') {
            name = data.name;
        }

        // Create Chat Room
        $('#chatRoom').append($('<div>', {
            id: 'rc' + data.id,
            'class': 'chatRoom',
            'style': 'display: none;'
        }));

        // Create List Item
        $('#roomsList').append(
            $('<div>', {
                'id': 'rl' + data.id,
                'class': 'none room-box',
                'html': '<h5>' + name + '</h5><span></span>'
            }).on('click', function () {
                app.rooms.change(data.id,name);
            })
        );
        $('#rl' + data.id).fadeIn(250);

        // Activate Room
        if (data.type === 'general') {
            app.rooms.change(data.id,name);
        }
        // Notify
        if (data.type !== 'general') {
            app.notify.room();
        }
    },

    remove: function (id) {
        if (id === app.data.clase()) {
            return;
        }
        $('#rl' + id + ', #rc' + id).fadeOut(250, function() {
            $(this).remove();
            app.rooms.change(app.data.clase());
        });
    },

    // Se han recibido nuevos mensajes en esta sala
    update: function (id) {
        var $el = $('#rl' + id + ' span');

        // If the user is not reading this
        if (id !== app.rooms.active) {
            $el.html('1');
        } else {
            $el.html('');
        }
    },

    change: function (id,name) {
        // Leave item active
        $('#rl' + app.rooms.active + ' span').html('');

        // Change item active
        $('#roomsList > div').removeClass('active');
        $('#rl' + id).addClass('active');
        $('#chatTitle h5').text(name);
        $('#rl' + id + ' span').html('');

        // Change chat active
        $('.chatRoom').css('display', 'none');
        $('#rc' + id).css('display', 'table-cell');

        // Actualizar el estado de sala
        $('#content-chat').scrollTop($('#rc' + id).height());
        $('#message').val('').focus();

        // Change room active
        app.rooms.active = id;
    },

    // Sacar usuario de una sala
    // data: {room, id}
    getout: function (data) {
        var leftUsers = _.without(this.cache[data.room].users, data.id);
        if (leftUsers.length === 1) {
            app.emit.getout(data.room);
            this.remove(data.room);
        }
    }

};
