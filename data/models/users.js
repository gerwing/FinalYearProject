/*
 * Users Data Model
 */

var mongoose = require('mongoose');
var UserSchema = require('../schemas/users');

var Users = mongoose.model('Users', UserSchema);

module.exports = Users;