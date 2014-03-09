/*
 * Lecture Submissions Data Model
 */

var mongoose = require('mongoose');
var lSubmissionsSchema = require('../schemas/lSubmissions');

var lSubmissions = mongoose.model('LectureSubmissions', lSubmissionsSchema);

module.exports = lSubmissions;