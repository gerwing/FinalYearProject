/*
 *  Passport Module Configuration for Authentication
 */
var User = require('../data/models/users'),
    LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    //Local Strategy for Registered Users
    passport.use(new LocalStrategy(
        function(username, password, done) {
            //Lookup User
            User.findOne({username:username}, function(err, user) {
                if(err) { //Error Occured
                    return done(err);
                }
                if(!user) { //Not a registered user
                    return done(null, false, {message: 'Incorrect Username', problem:'username'});
                }
                //Check if password is correct
                user.validPassword(password, function(err, isMatch) {
                    if(err) {
                        return done(err);
                    }
                    if(isMatch) { //Correct Password
                        return done(null, user);
                    }
                    else { //Wrong Password
                        return done(null, false, {message: 'Incorrect Password', problem:'password'});
                    }
                });
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
};