var mongoose = require('mongoose');

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
        lecture: {
            type: Schema.ObjectId,
            ref: 'Lectures'
        }
    }],
    homework: [{
        homework: {
            type: Schema.ObjectId,
            ref: 'Homework'
        }
    }]

});

module.exports = ModuleSchema;