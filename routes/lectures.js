
/*
 * Lectures API Routes.
 */

var basePathTeacher = '/api/teacher/lectures',
    basePathStudent = '/api/student/lectures',
    Lecture = require('../data/models/lectures'),
    Module = require('../data/models/modules'),
    loggedInAsTeacher = require('../middleware/api/loggedInAsTeacher'),
    loggedIn = require('../middleware/api/loggedIn');

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
        //Verify module id exists
        if(!id) {
            return res.send('It is required to include the module ID', 406); //no module ID
        }
        //Get Module from DB
        Module.findOne({_id:id, teacher:teacher}, function(err, module) {
            if(err) {
                return next(err); //Server error
            }
            if(!module) {
                return res.send('Module does not exist', 404); //Module not found
            }
            //Check what to insert
            var insert = {};
            if(req.body.name) {
                insert.name = req.body.name;
            }
            insert.teacher = teacher;
            insert.module = id;
            //Create and save Lecture
            Lecture.create(insert, function(err, lecture) {
                if(err) {
                    return next(err);
                }
                //Add Lecture to module and save module
                module.lectures.push(lecture._id);
                module.save(function(err) {
                    if(err) {
                        return next(err);
                    }
                    res.send(lecture);
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
        if(req.body.isLive === true || req.body.isLive === false) {
            update.isLive = req.body.isLive;
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
        Module
            .findOne({lectures:id, teacher:teacher})
            .populate({
                path: 'lectures',
                match: { _id: id}
            })
            .exec( function(err, module) {
                if(err) {
                    return next(err);
                }
                if(!module) {
                    return res.send('Lecture does not exist', 404); //Module not found
                }
                //remove lecture from module
                var lecture = module.lectures[0];
                lecture.remove(function(err) {
                    if(err) {
                        return next(err);
                    }
                    res.send('Success', 200);
                })
            });
    });

    /**STUDENT API*/
    //STUDENT GET ALL LIVE LECTURES
    app.get(basePathStudent, loggedIn, function(req,res,next) {
        Module
            .find({_id:{$in:req.user.subscribedTo}})
            .distinct('lectures')
            .exec(function(err, result) {
                if(err) {
                    return next(err);
                }
                Lecture
                    .find({_id:{$in:result},isLive:true})
                    .populate('module','name')
                    .sort('+module.name')
                    .exec(function(err, results) {
                        if(err) {
                            return next(err);
                        }
                        res.send(results);
                    })
            });
    });
};
