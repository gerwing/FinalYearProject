
/*
 * Module API Routes.
 */

var basePathTeacher = '/api/teacher/modules',
    Module = require('../data/models/modules'),
    Lecture = require('../data/models/lectures'),
    Homework = require('../data/models/homework'),
    loggedInAsTeacher = require('../middleware/loggedInAsTeacher');


module.exports = function(app) {

    //TEACHER GET ALL
	app.get(basePathTeacher, loggedInAsTeacher, function(req, res, next) {
        var teacher = req.user.id;
        //Get Modules from Database, Include only name and id
        Module.find({teacher:teacher}, 'name _id', function(err, results) {
           if(err) {
               return next(err);
           }
           res.send(results);
        });
	});

    //TEACHER GET ONE
    app.get(basePathTeacher + '/:id', loggedInAsTeacher, function(req, res, next) {
        var id = req.params.id;
        var teacher = req.user.id;
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
    app.post(basePathTeacher, loggedInAsTeacher, function(req, res, next) {
        //Check what to insert
        var insert = {};
        if(req.body.name)
            insert.name = req.body.name;
        insert.teacher = req.user.id;
        //Save Module to DB
        Module.create(insert, function(err, module) {
            if(err) {
                return next(err);
            }
            res.send(module);
        });
    });

    //TEACHER PUT
    app.put(basePathTeacher + '/:id', loggedInAsTeacher, function(req, res, next) {
        var id = req.params.id;
        var teacher = req.user.id;
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
    app.delete(basePathTeacher + '/:id', loggedInAsTeacher, function(req, res, next) {
        var id = req.params.id;
        var teacher = req.user.id;
        //Delete Module in database
        Module.findOne({_id:id, teacher:teacher}, function(err, module) {
            if(err) {
                return next(err);
            }
            if(!module) {
                return res.send('Module does not exist', 404); //Module not found
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
                res.send('Success', 200);
            })
        })
    });
};
