
/*
 * Lectures API Routes.
 */

var basePathTeacher = '/api/teacher/lectures',
    Lecture = require('../data/models/lectures'),
    Module = require('../data/models/modules'),
    loggedInAsTeacher = require('../middleware/loggedInAsTeacher');

module.exports = function(app) {

    //TEACHER GET ONE
    app.get(basePathTeacher + '/:id', loggedInAsTeacher, function(req, res, next) {
        var id = req.params.id;
        var teacher = req.user.id;
        //Get Lecture from DB
        Lecture.findOne({_id:id, teacher:teacher}, function(err,result) {
           if(err) {
               return next(err);
           }
           res.send(result);
        });
    });

    //TEACHER POST
    app.post(basePathTeacher, loggedInAsTeacher, function(req, res,next) {
        var id = req.body.module;
        var teacher = req.user.id;
        //Get Module from DB
        Module.findOne({_id:id, teacher:teacher}, function(err, module) {
            if(err) {
                return next(err);
            }
            //Create Lecture
            Lecture.create({name:req.body.name, teacher:teacher}, function(err, lecture) {
                if(err) {
                    return next(err);
                }
                //Add Lecture to module and save module
                module.lectures.push(lecture._id);
                module.save(function(err) {
                    if(err) {
                        return next(err);
                    }
                    res.send('Success', 200);
                })
            })
        });

    });

    //TEACHER PUT
    app.put(basePathTeacher + '/:id', loggedInAsTeacher, function(req, res, next) {
        var id = req.params.id;
        var teacher = req.user.id;
        //Check what to update; name or both name and questions
        var update = {name:req.body.name};
        if(req.body.questions) {
            update.questions = req.body.questions;
        }
        //Update Lecture in DB
        Lecture.update({_id:id, teacher:teacher}, update, function(err) {
            if(err) {
                return next(err);
            }
            res.send('Success', 200);
        });
    });

    //TEACHER DELETE
    app.delete(basePathTeacher + '/:id', loggedInAsTeacher, function(req, res, next) {
        var id = req.params.id;
        var teacher = req.user.id;
        //Find Module that contains Lecture
        //TODO check wether query is correct
        Module.findOne({lectures:id, teacher:teacher}, function(err, module) {
            if(err) {
                return next(err);
            }
            //remove lecture from module
            module.lectures.splice(module.lectures.indexOf(id));
            module.save(function(err) {
               if(err) {
                   return next(err) ;
               }
               Lecture.remove({_id:id, teacher:teacher}, function(err) {
                    if(err) {
                        return next(err);
                    }
                    res.send('Success', 200);
               });
            });
        });
    });
};
