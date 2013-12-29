
/*
 * Module API Routes.
 */

var basePath = '/api/modules';

module.exports = function(app) {

    //GET ALL
	app.get(basePath, function(req, res) {
        //Function Code
		res.render('index', { title: 'Module Get' }); // example
	});

    //GET ONE
    app.get(basePath + '/:id', function(req, res) {
        var id = req.params.id;
        //Function Code
        res.render('index', { title: 'Module Get' + id }); // example
    });

    //POST
    app.post(basePath, function(req, res) {
        //Function Code
        res.send('POST'); // example
    });

    //PUT
    app.put(basePath + '/:id', function(req, res) {
        var id = req.params.id;
        //Function Code
        res.send('PUT ' + id); // example
    });

    //DELETE
    app.delete(basePath + '/:id', function(req, res) {
        var id = req.params.id;
        //Function Code
        res.send('DELETE ' + id); // example
    });
};
