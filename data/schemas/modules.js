/*
 * Modules Data Schema
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ModuleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        default:'New Module'
    },
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

module.exports = ModuleSchema;