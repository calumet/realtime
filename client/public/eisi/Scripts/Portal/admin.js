/*!
 * Grupo de Desarrollo de Software Calumet
 * Portal | Admin
 * Romel Pérez, prhone.blogspot.com
 * 2014
 **/

/**
 * Las funcionalidades que utiliza un administrador están verificadas
 * tanto en el cliente como en el servidor.
 */

$(function ($) {

    portal.stats = {};

    // Actualizando estadísticas
    portal.stats.interval = setInterval(function () {
        $.ajax({
            url: portal.server.url + '/app/portal/stats',
            data: {
                id: portal.user.id
            }
        }).done(function (data) {
            if (data.error) {
                data = {
                    count: 'ERROR'
                };
            }
            portal.stats.count = data.count;
            $('#statsUsers').html(data.count);
        });
    }, 1000);

});
