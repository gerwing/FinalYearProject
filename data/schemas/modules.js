/*
 * Modules Data Schema
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    shortId = require('shortid');

var ModuleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        default:'New Module'
    },
    shortId: {
        type: String,
        unique: true,
        index: true
    },
    emailRestrictions: [String],
    teacher: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Users'
    },
    lectures: [{
        type: Schema.ObjectId,
        ref: 'Lectures'
    }],
    homework: [{
        type: Schema.ObjectId,
        ref: 'Homework'
    }]

});

//Add Short id to module
ModuleSchema.pre('save', function(next) {
    if(!this.isNew) {
        //Only add short id when creating new module
        return next();
    }
    var module = this;
    module.shortId = shortId.generate();
    next();
});

module.exports = ModuleSchema;