/*!
 * Grupo de Desarrollo de Software Calumet
 * Portal | Login
 * Romel Pérez, @prhonedev
 * 2014
 **/

$('#users').select2({
    width: 400,
    minimumResultsForSearch: -1
});

$('#enter').on('click', function (e) {
    var id = $('#users').select2('val');
    window.location.href = '/portal?id=' + id;
});
