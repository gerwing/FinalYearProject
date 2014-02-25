/*
 * Authentication routes serving Web App
 */

var loggedInAsTeacher = require('../middleware/web/loggedInAsTeacher'),
    loggedIn = require('../middleware/web/loggedIn');

module.exports = function(app, passport) {

    //TODO make safer method or use https
    /**API USER AUTHENTICATION*/
    //LOGIN USER USING API
    app.post('/api/teacher/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) {
                return res.send(info, 401);
            }
            if(!user.isTeacher) {
                return res.send({message:"You're not a Teacher"}, 401);
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.send(user);
            });
        })(req, res, next);
    });

    //LOGIN USER USING API
    app.post('/api/student/login', function(req, res, next) {
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
    app.post('/api/user/logout', loggedIn, function(req,res) {
        req.logout();
        res.send({message:'Successfully Logged out'} , 200);
    });

    //RETRIEVE CURRENT USER
    app.get('/api/currentUser', function(req,res) {
        res.send(req.user);
    });
};
