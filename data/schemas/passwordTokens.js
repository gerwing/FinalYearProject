/*
 * Password Tokens Schema
 * Code Inspired by Daniel Studds, http://danielstudds.com
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uuid = require('node-uuid');
;

var passwordTokenSchema = mongoose.Schema({
    user: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Users'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: '1h'
    }
});

passwordTokenSchema.pre('save', function (next) {
    if(!this.isNew) {
        //Only add token when creating verificationToken
        return next();
    }
    var passwordToken = this;
    var token = uuid.v4();
    passwordToken.token = token;
    next();
});

module.exports = passwordTokenSchema;