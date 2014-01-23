/*
 * Authentication routes serving Web App
 */

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../data/models/users'),
    loggedInAsTeacher = require('../middleware/loggedInAsTeacher');

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

//Serialize, Deserialize methods
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

//EXPORT ROUTES
module.exports = function(app) {
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
