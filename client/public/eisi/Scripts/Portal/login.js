/*!
 * Grupo de Desarrollo de Software Calumet
 * Portal | Login
 * Romel Pérez, prhone.blogspot.com
 * 2014
 **/

$('#users').select2({
    width: 400,
    minimumResultsForSearch: -1
});

// Entrar como usuario
$('#portal').on('click', function (e) {
    var id = $('#users').select2('val');
    window.location.href = '/portal?id='+ id;
});

// Entrar como administrador
/*$('#admin').on('click', function (e) {
    var id = $('#users').select2('val');
    window.location.href = '/portal';
});*/
