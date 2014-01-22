/*
 * Lectures Data Schema
 */

var mongoose = require('mongoose');

var LectureSchema = mongoose.Schema({
    name:String,
    teacher: {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    questions: [{
        question: String,
        correctAnswer: {answer: String},
        otherAnswers: [{answer: String}]
    }]
});

module.exports = LectureSchema;


