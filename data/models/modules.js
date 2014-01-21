var mongoose = require('mongoose');
var ModuleSchema = require('../schemas/modules');

var Modules = mongoose.model('Modules', ModuleSchema);

module.exports = Modules;