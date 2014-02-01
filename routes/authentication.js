/*
 * Authentication routes serving Web App
 */

var loggedInAsTeacher = require('../middleware/web/loggedInAsTeacher');

module.exports = function(app, passport) {

    //RETRIEVE CURRENT USER
    //TODO make safer method or use https
    app.get('/api/currentUser', function(req,res) {
        res.send(req.user);
    });

    //LOGIN TEACHER
    app.post('/teacher/login', passport.authenticate('local',
        {successRedirect:'/teacher', failureRedirect:'/teacher/login'}
    ));

    //LOGIN TEACHER USING API
    app.post('/api/teacher/login', function(req, res, next) {
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

    //LOGOUT TEACHER
    app.post('/teacher/logout', loggedInAsTeacher, function(req,res) {
        req.logout();
        res.redirect('/');
    });

    //LOGOUT TEACHER USING API
    app.post('/api/teacher/logout', loggedInAsTeacher, function(req,res) {
        req.logout();
        res.send({message:'Successfully Logged out'} , 200);
    });

    //TODO When decided how to handle login Students, make sure to merge teacher and student login methods
    //All login actions should go through either one API or one Web login method and the same for logout
    //User vs Teacher should be determined using the roles attached to the user
};
