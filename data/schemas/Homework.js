/*
 * Homework Data Schema
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HomeworkSchema = mongoose.Schema({
    name: {
        type: String,
        required:true,
        default:'New Homework'
    },
    teacher: {
       type: Schema.ObjectId,
       ref: 'Users',
       required: true
    },
    timesDone: {type: Number, default: 0},
    questions: [{
       question: String,
       correctAnswer: {answer: String, timesAnswered: {type: Number, default:0}},
       otherAnswers: [{answer: String, timesAnswered: {type: Number, default:0}}]
    }],
    isLive: {
        type: Boolean,
        default: false
    }
});

module.exports = HomeworkSchema;