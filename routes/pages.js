
/*
 * Pages routes serving Web App
 */

module.exports = function(app) {

    //GET INDEX
    app.get('/', function(req, res){
        res.render('index', { title: 'Express' });
    });

    //LOGIN TEACHER
    app.post('/teacher/login', function(req,res) {
        //Login Teacher
    });

    //REGISTER TEACHER
    app.post('/teacher/register', function(req,res) {
       //Register Teacher
    });
};