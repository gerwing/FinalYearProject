/*
 * Lecture Student ID List Data Model
 */

var mongoose = require('mongoose');
var lStudentIDListSchema = require('../schemas/lStudentIDLists');

var lStudentIDLists = mongoose.model('LectureStudentIDLists', lStudentIDListSchema);

module.exports = lStudentIDLists;