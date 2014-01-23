/*
 * User routes
 */
var User = require('../data/models/users');

module.exports = function(app) {

    //REGISTER TEACHER
    //TODO redirect to teacher page and login teacher
    app.post('/teacher/register', function(req,res,next) {
        //Mark as teacher
        var newTeacher = req.body;
        newTeacher.isTeacher = true;
        //Register Teacher
        User.create(newTeacher, function(err) {
            if(err) {
                //Username already taken
                if(err.code === 11000) {
                    res.send('Conflict', 409);
                }
                else if(err.name === 'ValidationError') {
                    return res.send(Object.keys(err.errors).map(function(errField){
                        return err.errors[errField].message;
                    }).join('. '), 406);
                }
                else {
                    next(err);
                }
                return;
            }
            res.send('Success', 200);
        });
    });

    //UPDATE TEACHER
    //TODO complete
    app.put('/teacher/:id', function(req,res) {
        //Update Teacher Account
    });

    //DELETE TEACHER
    //TODO complete
    app.delete('/teacher/:id', function(req,res) {
        //Delete Teacher Account
    });

};