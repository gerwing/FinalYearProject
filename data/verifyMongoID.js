/*
 * Verify Mongo ID, used to verify if the ID passed is a mongodb ID
 */

var mongoose = require('mongoose');

module.exports = function(id, done) {
    try {
        var idNew = mongoose.Types.ObjectId(id);
    }
    catch(err) {
       return false; //JUP, Error mate
    }
    return true; //No Error
}