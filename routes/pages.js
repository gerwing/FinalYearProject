/*
 * Pages routes serving Web App
 */

module.exports = function(app) {

    //GET INDEX
    app.get('/', function(req, res){
        res.render('index', { title: 'Express' });
    });
};