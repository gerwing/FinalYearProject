
/*
 * Homework API Routes.
 */

var basePathTeacher = '/api/teacher/homework',
    Homework = require('../data/models/homework'),
    Module = require('../data/models/modules'),
    loggedInAsTeacher = require('../middleware/loggedInAsTeacher');

module.exports = function(app) {

    //TEACHER GET ONE
    app.get(basePathTeacher + '/:id', loggedInAsTeacher, function(req, res, next) {
        var id = req.params.id;
        var teacher = req.user.id;
        //Get Homework from DB
        Homework.findOne({_id:id, teacher:teacher}, function(err,result) {
           if(err) {
               return next(err);
           }
           res.send(result);
        });
    });

    //TEACHER POST
    app.post(basePathTeacher, loggedInAsTeacher, function(req, res, next) {
        var id = req.body.module;
        var teacher = req.user.id;
        //Verify module id exists
        if(!id) {
            return res.send('It is required to include the module ID', 406); //no module ID
        }
        //Get Module from DB
        Module.findOne({_id:id, teacher:teacher}, function(err, module) {
            if(err) {
                return next(err);
            }
            if(!module) {
                return res.send('Module does not exist', 404); //Module not found
            }
            //Check what to insert
            var insert = {};
            if(req.body.name)
                insert.name = req.body.name;
            insert.teacher = teacher;
            //Create Lecture
            Homework.create(insert, function(err, homework) {
                if(err) {
                    return next(err);
                }
                //Add Lecture to module and save module
                module.homework.push(homework._id);
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
        var update = {};
        //Check what to update; name, update or both name and questions
        if(req.body.name) {
            update.name = req.body.name;
        }
        if(req.body.questions) {
            update.questions = req.body.questions;
        }
        //Update Lecture in DB
        Homework.update({_id:id, teacher:teacher}, update, function(err) {
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
        Module.findOne({homework:id, teacher:teacher}, function(err, module) {
            if(err) {
                return next(err);
            }
            if(!module) {
                return res.send('Homework does not exist', 404); //Module not found
            }
            //remove lecture from module
            module.homework.splice(module.homework.indexOf(id),1);
            module.save(function(err) {
                if(err) {
                    return next(err) ;
                }
                Homework.remove({_id:id, teacher:teacher}, function(err) {
                    if(err) {
                        return next(err);
                    }
                    res.send('Success', 200);
                });
            });
        });
    });
};
