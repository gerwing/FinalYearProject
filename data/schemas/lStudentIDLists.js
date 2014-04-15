/*
 * Lecture Student ID List Data Schema
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    shortId = require('shortid');

var lStudentIDListSchema = mongoose.Schema({
    lecture: {
        type: Schema.ObjectId,
        ref: 'Lectures',
        required: true
    },
    teacher: {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    idList: [String],
    timeAdded: {
        type: Date,
        default: Date.now
    }
});

lStudentIDListSchema.pre('save', function(next) {
    if(!this.isNew) {
        //Only generate list when saving new sIDList
        return next();
    }
    var lStudentIDList = this;
    for(var i=0;i<100;i++) {
        var id = shortId.generate();
        lStudentIDList.idList.push(id);
    }
    next();
});

module.exports = lStudentIDListSchema;