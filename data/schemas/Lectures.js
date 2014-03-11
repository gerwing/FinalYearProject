/*
 * Lectures Data Schema
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LectureSchema = mongoose.Schema({
    name: {
        type: String,
        required:true,
        default:'New Lecture'
    },
    teacher: {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    module: {
        type: Schema.ObjectId,
        ref: 'Modules',
        required: true
    },
    timesDone: {type: Number, default: 0},
    questions: [{
        question: String,
        answers: [{
            answer: String,
            timesAnswered: {type: Number, default:0},
            correct: Boolean
        }]
    }],
    isLive: {
        type: Boolean,
        default: false
    }
});

module.exports = LectureSchema;


