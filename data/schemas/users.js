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
    bcrypt.genSalt(10, function(err, salt) {
        if(err) {
            return next(err);
        }
        bcrypt.hash(this.password, salt, function(err, hash) {
            if(err) {
                return next(err);
            }
            this.password = hash;
            next();
        });
    });
});

//Password Hash Verification
UserSchema.methods.validPassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if(err) {
            return done(err);
        }
        done(null, isMatch);
    });
};

module.exports = UserSchema;