/*!
 * PRHONE Applications
 * Central | URLs
 * Romel Pérez, 2013
 **/

// ------------------------------------------------------------------------- //
// URLS //

exports.listen = function(app){
	app.get('/', function(req, res){
		res.render('index');
	});
	app.get('/:app', function(req, res){
		res.render(req.params.app);
	});
};
