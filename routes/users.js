/*
 * User routes
 */
var User = require('../data/models/users'),
    Module = require('../data/models/modules'),
    loggedIn = require('../middleware/api/loggedIn');

module.exports = function(app) {

    /**TEACHER API*/
    //REGISTER TEACHER
    app.post('/api/teacher/register', function(req,res,next) {
        //Mark as teacher
        var newTeacher = req.body;
        newTeacher.isTeacher = true;
        //Register Teacher
        User.create(newTeacher, function(err, user) {
            if(err) {
                //Username already taken
                if(err.code === 11000) {
                    res.send({message:'Your chosen username is already taken'}, 409);
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
            //Login teacher
            req.login(user, function(err) {
                if (err) { return next(err); }
                return res.send(user, 201);
            });
        });
    });

    //UPDATE TEACHER
    //TODO complete
    app.put('/api/teacher/:id', function(req,res) {
        //Update Teacher Account
    });

    //DELETE TEACHER
    //TODO complete
    app.delete('/api/teacher/:id', function(req,res) {
        //Delete Teacher Account
    });

    /**STUDENT API*/
    //REGISTER STUDENT
    app.post('/api/student/register', function(req,res,next) {
        var newStudent = req.body;
        //Mark as student
        newStudent.isTeacher = false;
        newStudent.name = "Student";
        newStudent.email = newStudent.username;
        //Register Student
        User.create(newStudent, function(err, user) {
            if(err) {
                //Username already taken
                if(err.code === 11000) {
                    res.send({message:'You already registered with that email'}, 409);
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
            //Login student
            req.login(user, function(err) {
                if (err) { return next(err); }
                return res.send(user, 201);
            });
        });
    });

    //DELETE Student
    //TODO complete
    app.delete('/api/student/:id', function(req,res) {
        //Delete Student Account
    });

    //SUBSCRIBE TO MODULE
    app.post('/api/student/subscribe', loggedIn, function(req,res, next) {
        var id = req.body.id;
        var user = req.user;
        //Lookup module and if it exists, add it to user subscriptions
        Module.findOne({_id:id}, function(err, module) {
            if(err) {
                return next(err);
            }
            if(!module) {
                return res.send({message:'Module does not exist'}, 404); //Module not found
            }
            if(user.subscribedTo) {
                user.subscribedTo = new Array();
            }
            user.subscribedTo.push(id);
            user.save(function(err) {
                if(err) {
                    return next(err);
                }
                res.send(user, 200);
            });
        })
    });

};