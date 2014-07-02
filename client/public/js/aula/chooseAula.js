/*!
 * Grupo de Desarrollo de Software Calumet
 * JSP | Login
 * Romel Pérez, @prhonedev
 * 2014
 **/

var app = {
    users: null
};

// DOM Events
$(function () {

    $('#clases').select2({
        width: 400,
        minimumResultsForSearch: -1
    }).on('change', function () {

        // Conseguir usuarios de la clase seleccionada
        $.ajax({
            type: 'post',
            url: '/getUsersByClass',
            data: {
                clase: $('#clases').select2('val')
            },
            success: function (res) {
                var options = '';
                // Guardar cache
                app.users = res.users;
                // Colocar usuarios en selector
                _.each(res.users, function (user, i) {
                    options += '<option value="'+ user.id +'">'
                            + user.firstName + ' '
                            + user.firstSurname +'</option>'
                });
                // Mostrar usuarios
                $('#users').html(options).select2({width: 400});
            },
            error: function () {
                console.debug('>>> Error conectando con el servidor!');
            }
        });

    }).trigger('change');  // Conseguir usuarios cuando ya esté cargada la página

    $('#users').select2({width: 400});

    // Entrar al aula
    $('#enter').on('click', function(e) {
        var clase = $('#clases').select2('val');
        var id = $('#users').select2('val');
        var name = app.users[id].firstName + ' ' + app.users[id].firstSurname;

        window.location.href = '/aula?clase=' + clase + '&id=' + id + '&name=' + name;
    });

});