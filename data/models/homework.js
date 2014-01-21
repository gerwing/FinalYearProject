/*
 * Homework Data Model
 */

var mongoose = require('mongoose');
var HomeworkSchema = require('../schemas/homework');

var Homework = mongoose.model('Homework', HomeworkSchema);

module.exports = Homework;