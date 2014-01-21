/*
 * Lectures Data Model
 */

var mongoose = require('mongoose');
var LectureSchema = require('../schemas/lectures');

var Lectures = mongoose.model('Lectures', LectureSchema);

module.exports = Lectures;