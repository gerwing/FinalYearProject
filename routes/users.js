/*
 * User routes
 */
var User = require('../data/models/users');

module.exports = function(app) {

    //REGISTER TEACHER
    app.post('/teacher/register', function(req,res,next) {
        //Mark as teacher
        var newTeacher = req.body;
        newTeacher.isTeacher = true;
        //Register Teacher
        User.create(newTeacher, function(err) {
            if(err) {
                return next(err);
            }
            res.send('Success', 200);
        });
    });

    //UPDATE TEACHER
    app.put('/teacher/:id', function(req,res) {
        //Update Teacher Account
    });

    //DELETE TEACHER
    app.delete('/teacher/:id', function(req,res) {
        //Delete Teacher Account
    });

};