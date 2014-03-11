/*
 * Lectures Data Schema
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    shortId = require('shortid');

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
    accessID: {
        type: String
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

LectureSchema.methods.generateAccessID = function(next) {
    var lecture = this;
    lecture.accessID = shortId.generate();
    return this.save(next);
};
LectureSchema.methods.removeAccessID = function(next) {
    var lecture = this;
    lecture.accessID = null;
    return this.save(next);
};

module.exports = LectureSchema;


