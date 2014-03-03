/*
 * Homework Submissions Data Schema
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var hSubmissionsSchema = mongoose.Schema({
    user: {
       type: Schema.ObjectId,
       ref: 'Users',
       required: true
    },
    homework: {
        type: Schema.ObjectId,
        ref: 'Homework',
        required: true
    },
    results: [{
       question: String,
       answer: String,
       correct: Boolean
    }],
    timeAdded: {
        type: Date,
        default: Date.now
    }
});

module.exports = hSubmissionsSchema;