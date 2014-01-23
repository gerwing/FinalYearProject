/*
 * Authentication routes serving Web App
 */

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../data/models/users');

//SETUP PASSPORT
passport.use(new LocalStrategy(
    function(username, password, done) {
        //Lookup User
        User.findOne({username:username}, function(err, user) {
            if(err) {
                return done(err);
            }
            if(!user) {
                return done(null, false, {message: 'Incorrect Username'});
            }
            //TODO HASH PASSWORD
            if(password != user.password) {
                return done(null, false, {message: 'Incorrect Password'});
            }
            return done(null, user);
        });
    }
));

//EXPORT ROUTES
module.exports = function(app) {
    //LOGIN TEACHER
    //TODO Test redirect to same page
    app.post('/teacher/login', passport.authenticate('local',
        {successRedirect:'/teacher', failureRedirect:'/teacher'}
    ));

    //LOGOUT TEACHER
    app.post('/teacher/logout', function(req,res) {
        req.logout();
        res.redirect('/');
    });
};
