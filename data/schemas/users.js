/*
 * Users Data Schema
 */

var mongoose = require('mongoose');

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

module.exports = UserSchema;