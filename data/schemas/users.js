/*
 * Users Data Schema
 */

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    Schema = mongoose.Schema;

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
        unique: true,
        required: true
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    isTeacher: {
        type: Boolean,
        default: false
    },
    subscribedTo: [{
        type: Schema.ObjectId,
        ref: 'Modules'
    }]
});

//Hash Password before saving to DB
UserSchema.pre('save', function(next) {
    if(!this.isNew) {
        //Only hash password when creating new user
        return next();
    }
    var user = this;
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if(err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

//Hash New Password
UserSchema.methods.hashPassword = function(password, done) {
    var user = this;
    bcrypt.hash(password, null, null, function(err, hash) {
        if(err) {
            return done(err);
        }
        user.password = hash;
        done();
    });
};

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