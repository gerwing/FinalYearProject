/*
 * Authentication routes serving Web App
 */

var loggedInAsTeacher = require('../middleware/web/loggedInAsTeacher');

module.exports = function(app, passport) {

    //LOGIN TEACHER
    app.post('/teacher/login', passport.authenticate('local',
        {successRedirect:'/teacher', failureRedirect:'/teacher/login'}
    ));

    //LOGOUT TEACHER
    app.post('/teacher/logout', loggedInAsTeacher, function(req,res) {
        req.logout();
        res.redirect('/');
    });
};
