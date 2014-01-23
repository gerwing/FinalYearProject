/*
 * Pages routes serving Web App
 */

module.exports = function(app) {

    //GET INDEX
    app.get('/', function(req, res){
        res.render('index', { title: 'Express' });
    });

    //GET INDEX
    app.get('/teacher', function(req, res){
        res.render('index', { title: 'Private Teacher Area' });
    });

    //GET INDEX
    app.get('/teacher/login', function(req, res){
        res.render('index', { title: 'Login Teacher' });
    });
};