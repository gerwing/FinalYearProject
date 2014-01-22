
/*
 * Module API Routes.
 */

var Module = require('../data/models/modules');
var Lecture = require('../data/models/lectures');
var Homework = require('../data/models/homework');

var basePathTeacher = '/api/teacher/modules';

module.exports = function(app) {

    //TEACHER GET ALL
	app.get(basePathTeacher, function(req, res, next) {
        var teacher = '1234'; //TODO set teacher id
        //Get Modules from Database, Include only name and id
        Module.find({teacher:teacher}, 'name _id', function(err, results) {
           if(err) {
               return next(err);
           }
           res.send(results);
        });
	});

    //TEACHER GET ONE
    app.get(basePathTeacher + '/:id', function(req, res, next) {
        var id = req.params.id;
        var teacher = '1234'; //Todo set teacher id
        //Get Module from Database
        Module
            .findOne({_id:id, teacher:teacher})
            .populate('lectures', 'name _id')
            .populate('homework', 'name _id')
            .exec(function(err, result) {
                if(err) {
                    return next(err);
                }
                res.send(result);
            });
    });

    //TEACHER POST
    app.post(basePathTeacher, function(req, res, next) {
        var module = req.body;
        module.teacher = '1234'; //TODO set teacher id
        //Save Module to DB
        Module.create(module, function(err) {
            if(err) {
                return next(err);
            }
            res.send('Success', 200);
        });
    });

    //TEACHER PUT
    app.put(basePathTeacher + '/:id', function(req, res, next) {
        var id = req.params.id;
        var teacher = '1234';//TODO set teacher id
        //Update Module in Database
        Module.update({_id:id, teacher:teacher}, {name:req.body.name}, function(err){
           if(err) {
               return next(err);
           }
           res.send('Success', 200);
        });
    });

    //TEACHER DELETE
    //TODO Verify remove queries
    app.delete(basePathTeacher + '/:id', function(req, res, next) {
        var id = req.params.id;
        var teacher = '1234'; //TODO set teacher id
        //Delete Module in database
        Module.findOne({_id:id, teacher:teacher}, function(err, module) {
            if(err) {
                return next(err);
            }
            //Remove Lectures
            Lecture.remove({_id:{$in:module.lectures}}, function(err) {
                if(err) {
                    return next(err);
                }
            });
            //Remove Homework
            Homework.remove({_id:{$in:module.homework}}, function(err) {
                if(err) {
                    return next(err);
                }
            });
            //Remove Module
            module.remove(function(err) {
                if(err) {
                    return next(err);
                }
                res.send('Success',200);
            })
        })
    });
};
