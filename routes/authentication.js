/*
 * Authentication routes serving Web App
 */

var loggedInAsTeacher = require('../middleware/web/loggedInAsTeacher');

module.exports = function(app, passport) {

    //RETRIEVE CURRENT USER
    app.get('/api/currentUser', function(req,res) {
        res.send(req.user);
    });

    //LOGIN TEACHER
    app.post('/teacher/login', passport.authenticate('local',
        {successRedirect:'/teacher', failureRedirect:'/teacher/login'}
    ));

    //LOGIN TEACHER USING API
    app.post('/api/teacher/login', passport.authenticate('local', function(req,res) {
        res.send(req.user);
    }));

    //LOGOUT TEACHER
    app.post('/teacher/logout', loggedInAsTeacher, function(req,res) {
        req.logout();
        res.redirect('/');
    });

    //LOGOUT TEACHER USING API
    app.post('/api/teacher/logout', loggedInAsTeacher, function(req,res) {
        req.logout();
        res.send('Successfully Logged out', 200);
    });
};
