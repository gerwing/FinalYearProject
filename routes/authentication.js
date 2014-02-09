/*
 * Authentication routes serving Web App
 */

var loggedInAsTeacher = require('../middleware/web/loggedInAsTeacher');
var loggedIn = require('../middleware/web/loggedIn');

module.exports = function(app, passport) {

    //TODO make safer method or use https

    /**TEACHER SPECIFIC AUTHENTICATION*/
    //LOGIN TEACHER
    app.post('/teacher/login', passport.authenticate('local',
        {successRedirect:'/teacher', failureRedirect:'/teacher/login'}
    ));

    //LOGOUT TEACHER
    app.post('/teacher/logout', loggedInAsTeacher, function(req,res) {
        req.logout();
        res.redirect('/teacher/login');
    });

    /**STUDENT SPECIFIC AUTHENTICATION*/
    //LOGIN STUDENT
    app.post('/student/login', passport.authenticate('local',
        {successRedirect:'/student', failureRedirect:'/student/login'}
    ));

    //LOGOUT STUDENT
    app.post('/student/logout', loggedIn, function(req,res) {
        req.logout();
        res.redirect('/student/login');
    });

    /**API USER AUTHENTICATION*/
    //LOGIN USER USING API
    app.post('/api/user/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) {
                return res.send(info, 401);
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.send(user);
            });
        })(req, res, next);
    });

    //LOGOUT USER USING API
    app.post('/api/user/logout', loggedInAsTeacher, function(req,res) {
        req.logout();
        res.send({message:'Successfully Logged out'} , 200);
    });

    //RETRIEVE CURRENT USER
    app.get('/api/currentUser', function(req,res) {
        res.send(req.user);
    });
};
