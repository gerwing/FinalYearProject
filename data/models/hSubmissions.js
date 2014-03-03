/*
 * Homework Submissions Data Model
 */

var mongoose = require('mongoose');
var hSubmissionsSchema = require('../schemas/hSubmissions');

var hSubmissions = mongoose.model('HomeworkSubmissions', hSubmissionsSchema);

module.exports = hSubmissions;