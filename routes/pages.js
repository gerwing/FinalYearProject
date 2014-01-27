/*
 * Pages routes serving Web App
 */

var loggedInAsTeacher = require('../middleware/web/loggedInAsTeacher');

module.exports = function(app) {

    //GET INDEX
    app.get('/', function(req, res){
        res.render('index', { title: 'Express' });
    });

    //GET INDEX
    app.get('/teacher', loggedInAsTeacher, function(req, res){
        res.render('index', { title: 'Private Teacher Area of ' + req.user.name});
    });

    //GET INDEX
    app.get('/teacher/login', function(req, res){
        res.render('index', { title: 'Login Teacher' });
    });
};