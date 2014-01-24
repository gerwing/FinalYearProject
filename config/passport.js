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

};