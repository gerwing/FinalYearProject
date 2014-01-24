/*
 * Users Data Schema
 */

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');

var UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isTeacher: {
        type: Boolean,
        default: false
    }
});

//Hash Password before saving to DB
UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if(err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

//Password Hash Verification
UserSchema.methods.validPassword = function(password, done) {
    var user = this;
    bcrypt.compare(password, user.password, function(err, isMatch) {
        if(err) {
            return done(err);
        }
        done(null, isMatch);
    });
};

module.exports = UserSchema;