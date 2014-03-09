/*
 * Lecture Submissions Data Schema
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var lSubmissionsSchema = mongoose.Schema({
    user: {
       type: Schema.ObjectId,
       ref: 'Users',
       required: true
    },
    lecture: {
        type: Schema.ObjectId,
        ref: 'Lectures',
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

module.exports = lSubmissionsSchema;