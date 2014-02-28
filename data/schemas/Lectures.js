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
    questions: [{
        question: String,
        correctAnswer: {answer: String},
        otherAnswers: [{answer: String}]
    }],
    isLive: {
        type: Boolean,
        default: false
    }
});

module.exports = LectureSchema;


