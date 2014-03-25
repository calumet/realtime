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

// Funciones como ventana dependiente de la ventana aula
app.popup = {

    wincon: 0,  // Intervalo de chequeo con la ventana del aula

    check: function () {
        app.popup.wincon = setInterval(function () {
            if (window.opener === null || !(window.opener.app && window.opener.app.chat)) {
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


// Funciones de la ventana
app.tool = {

    // Hacer ordenada la interfaz de la aplicación
    win: function () {
        var dims = Elise.win.dims();

        // Restricciones
        dims.width = dims.width < 600 ? 600 : dims.width;
        dims.height = dims.height < 300 ? 300 : dims.height;

        // Ancho contando bordes verticales
        $('#main').css('width', dims.width);
        $('#users').css('width', dims.width * 0.18 );
        $('#chat').css('width', dims.width * 0.64 - 50);
        $('#rooms').css('width', dims.width * 0.18 );

        // Alto contando bordes laterales
        $('#main').css('height', dims.height);
        $('#users, #rooms').css('height', dims.height - $('#header').height() -2);
        $('#chat').css('height', dims.height - $('#header').height() - 50);
        $('#content-chat').css('height', dims.height - $('#header').height() - $('#chatTitle').height() - $('.toolbar').height() - 54);
        $('#usersList, #roomsList').css('height', $('#users').height() - $('#usersTitle').height());
    }

};


// Registrar Eventos al DOM
app.dom = {

    init: function () {
        this.window();
        this.exit();
        this.messages();
        this.files();
    },


    // Eventos de la ventana
    window: function () {
        $(window).on('focus', function (e) {
            app.state.focus = true;
        });
        $(window).on('blur', function (e) {
            app.state.focus = false;
        });
    },


    // Salir de la aplicación
    exit: function () {
        $('#exit').on('click', function () {
            alert('¿Está seguro de querer salir?', {
                type: 'alert',
                buttons: [{
                    value: 'Sí',
                    click: function () {
                        window.close();
                    }
                }, {
                    value: 'No'
                }]
            });
        });
    },


    // Cuando se envía un mensaje
    messages: function () {
        var isEnter = document.getElementById('isEnter');
        var $message = $('#message');

        var send = function () {
            app.emit.msg({
                content: $message.val()
            });

            // Resetear input del mensaje
            setTimeout(function () {
                $message.trigger('blur').val('');
                setTimeout(function () {
                    $message.trigger('focus');
                }, 1);
            }, 1);
        };

        // Cuando se presione la tecla Enter
        $('#toolbar').on('keypress', function (e) {
            if (isEnter.checked && (e.which === 13 || e.keyCode === 13)) {
                send();
            }
        }).on('submit', function (e) {
            // Cuando se trate de enviar el formulario de mensaje
            e.preventDefault();
            return false;
        });
        $('#send').on('click', send);
    },


    // Crear una sala personalizada con este usuario y otros seleccionados
    rooms: {

        newRoomModal: null,

        main: function () {
            var $name = $('#createRoomName');
            var $users = $('#createRoomUsers');
            var users = '<option value=""></option>';

            // Colocar datos de usuarios
            _.each(app.users.cache, function (user, id) {
                users += '<option value="' + id + '">' + user.info.firstName + ' ' + user.info.firstSurname +'</option>';
            });
            $users.html(users).select2({
                placeholder: 'Selecciona...',
                width: 270,
                maximumSelectionSize: 10
            });

            // Lanzar sala
            var launchRoom = function (e) {
                var name = $('#createRoomName').val();
                var users = $('#createRoomUsers').val();

                // Validaciones
                if (name.length < 10 || name.length > 30) {
                    alert('El nombre de la sala debe tener mínimo 10 pero no más de 30 carácteres.', {type: 'error'});
                    return;
                } else if(users === null || users === ['']) {
                    alert('Debes seleccionar al menos otro usuario.', {type: 'error'});
                    return;
                }

                // Crear sala
                app.emit.newRoom({
                    type: 'custom',
                    name: name,
                    users: users
                });

                // Esconder ventana creadora
                this.hide();
            };

            // Mostrar ventana para crear una nueva sala
            $('#roomsCreate').on('click', function () {
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
                            btnText: "Cancelar",
                            btnColor: "rojo",
                            btnPosition: "left"
                        }]
                    });
                }
            });

        }

    },


    // Cargar archivos extras
    files: function () {

        // Sonidos
        var firefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
        var createSoundFile = function (source) {
            var audio = document.createElement("audio");
            var src = firefox ? '/sound/' + source + '.ogg' : '/sound/' + source + '.mp3';
            audio.src = src;
            audio.load();
            audio.refreshSoundToPlay = function () {
                audio.src = src;
                audio.play();
            };
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
            sound.refreshSoundToPlay();
        }
    },

    // Un nuevo mensaje ha llegado
    msg: function () {
        this._play(this.audios.msg);
    },

    // Un usuario se ha conectado
    user: function () {
        this._play(this.audios.user);
    },

    // Una sala ha sido creada conmigo
    room: function () {
        this._play(this.audios.room);
    }

};



// ------------------------------------------------------------------------- //
// USER //

app.user = {

    // Configurar interfaz de usuario
    start: function () {
        var user = app.data.user();

        // Información del usuario
        $('#photo').attr('src', user.photo);
        $('#user').html(
            user.firstName + ' ' + user.secondName + ' ' + user.firstSurname + ' ' + user.secondSurname
            + '<br>' + app.variables.categories[user.category] + ' - ' + user.code
        );

        // Información de la clase
        $('#subject').html(window.opener.app.data.subject + '<br>' + window.opener.app.data.teacher);

        // Mostrar interfaz de usuario
        $('#main').removeClass('invisible');

        // Modificar título de ventana
        window.document.title = 'Chat - ' + user.firstName + ' ' + user.firstSurname;
    },

    // Poner usuario en un estado de conexión
    set: function (state) {
        var i;
        var classes = ['offline', 'unavail', 'avail'];
        var $state = $('#photo');

        for (i = 0; i < classes.length; i += 1) {
            $state.removeClass(classes[i]);
        }
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

        // Agregar usuario a cache
        this.cache[data.id] = {
            state: data.state,
            info: data.info
        };

        // Crear interfaz de usuario
        $('#usersList').append(
            $('<div>', {
                'id': 'u' + data.id,
                'class': 'user',
                'html': '<img class="" src="' + data.info.photo + '">'
                      + '<div class="">' + name
                      + '<br>' + app.variables.categories[data.info.category] + '</dv>'
            })
        );

        // Colocar estado de usuario
        app.users.set(data.id, data.state);
        // Notificar
        if (data.state !== 'offline') {
            app.notify.user();
        }
    },


    // Un usuario se vuelve online
    online: function (id) {
        this.cache[id].state = 'avail';
        app.users.set(id, 'avail');
    },


    // Un usuario se vuelve offline
    offline: function (id) {
        this.cache[id].state = 'offline';
        app.users.set(id, 'offline');
    },


    // Actualizar el estado de un usuario
    set: function (id, state) {
        var i, $user, $state;
        var classes = ['offline', 'unavail', 'avail'];
        var $temp = $('#usersList > div.user.isconnected:last');

        $user = $('#u' + id);
        $state = $('#u' + id + ' > div');

        // Clasificar usuario
        if(state === 'offline') {
            $user.removeClass('isconnected');
        } else {
            $user.addClass('isconnected');
        }

        // Mover usuario según estado
        if ($temp.length === 0) {
            $('#usersList').prepend($user);
        } else {
            $temp.after($user);
        }

        // Actualizar estado
        for (i = 0; i < classes.length; i += 1) {
            $state.removeClass(classes[i]);
        }
        $state.addClass(state);
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

        // Insertar mensaje dependiendo de la sala
        if (lastMsg.find('.msg').hasClass(user_remoto.id) &&
            lastMsg.find('.msg').hasClass(hour + '_' + curMinute)) {

            // Si su comentario fue el ultimo no crea bloque para mensaje
            lastMsg.find('.content').append($('<p/>', {text: data.content}));

        } else {

            // Sino, crea bloque de menssaje
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

        // Notificar con sonido si es otro usuario o no está en focus la ventana
        if (user_remoto.id !== app.data.user().id || !app.state.focus) {
            app.notify.msg();
        }
        $('#content-chat').scrollTop($('#rc' + data.room).height());  // Mueve el scroll
        app.rooms.update(data.room);  // Actulizar la sala que recibe el mensaje
   }

};



// ------------------------------------------------------------------------- //
// ROOMS //

app.rooms = {

    // Sala de chat activa
    active: null,

    // Room Item Template
    roomItemTemplate: _.template($('#roomItemTemplate').html()),

    // { id: {name, type, users[ids]}, ... }
    cache: {},

    // data: {id, name, type, users[ids]}
    add: function (data) {
        var i, name = '';

        // Agregar sala al cache
        app.rooms.cache[data.id] = {
            name: data.name,
            type: data.type,
            users: data.users
        };

        // Colocar nombre a la sala
        if (data.type === 'general') {
            name = app.rooms.cache[data.id].name = 'Chat General';
        } else if (data.type === 'custom') {
            name = data.name;
        }

        // Crear contenedor de mensajes de sala
        $('#chatRoom').append($('<div>', {
            'id': 'rc' + data.id,
            'class': 'chatRoom',
            'style': 'display: none;'
        }));

        // Crear interfaz de la sala
        $('#roomsList').append(
            $(this.roomItemTemplate({
                id: data.id,
                name: name
            })).on('click', function () {
                app.rooms.change(data.id);
            })
        );
        $('#rl' + data.id).fadeIn(250);  // Mostrar la interfaz

        // Opciones de sala
        $('#rl' + data.id + ' .roomOptions').on('click', function (e) {
            e.stopPropagation();

            //
        });

        // Mostrar sala si es de clase
        if (data.type === 'general') {
            app.rooms.change(data.id);
        }
        // Notificar si no es una sala de clase
        if (data.type !== 'general') {
            app.notify.room();
        }
    },


    // Remover una sala personalizada de este usuario
    remove: function (id) {
        if (id === app.data.clase()) {
            return;
        }
        $('#rl' + id + ', #rc' + id).fadeOut(250, function() {
            $(this).remove();
            app.rooms.change(app.data.clase());
        });
    },


    // Si se han recibido nuevos mensajes en una sala
    update: function (id) {
        var $el = $('#rl' + id + ' span');

        // Si el usuario no está leyendo esto, avisar
        if (id !== app.rooms.active) {
            if (Elise.val.number($el.html())) {
                $el.html( Number($el.html()) === 9 ? '9+' : Number($el.html()) + 1 );
            } else if ($el.html() !== '9+') {
                $el.html('1');
            }
        }
    },


    // Cambiar la sala activa
    change: function (id) {
        // Dejar interfaz de sala
        $('#rl' + app.rooms.active + ' span').html('');

        // Cambiar a nueva interfaz activa
        $('#roomsList > div').removeClass('active');
        $('#rl' + id).addClass('active');
        $('#chatTitle h5').text(app.rooms.cache[id].name);
        $('#rl' + id + ' span').html('');

        // Cambiar contenedor de mensajes de sala
        $('.chatRoom').css('display', 'none');
        $('#rc' + id).css('display', 'table-cell');

        // Actualizar el estado de sala
        $('#content-chat').scrollTop($('#rc' + id).height());
        $('#message').val('').focus();

        // Colocar como nueva sala activa
        app.rooms.active = id;
    },


    // Sacar el éste usuario de una sala
    // data: {room, id}
    getout: function (data) {
        var leftUsers = _.without(this.cache[data.room].users, data.id);
        if (leftUsers.length === 1) {
            app.emit.getout(data.room);
            this.remove(data.room);
        }
    }

};
