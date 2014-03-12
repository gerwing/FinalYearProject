/*
 * Verification Tokens Model
 * Code Inspired by Daniel Studds, http://danielstudds.com
 */

var mongoose = require('mongoose');
var verificationTokenSchema = require('../schemas/verificationTokens');

var verificationTokens = mongoose.model('verificationTokens', verificationTokenSchema);

module.exports = verificationTokens;