/*
 * Password Tokens Model
 * Code Inspired by Daniel Studds, http://danielstudds.com
 */

var mongoose = require('mongoose');
var passwordTokenSchema = require('../schemas/passwordTokens');

var passwordTokens = mongoose.model('passwordTokens', passwordTokenSchema);

module.exports = passwordTokens;