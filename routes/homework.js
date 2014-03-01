
/*
 * Homework API Routes.
 */

var basePathTeacher = '/api/teacher/homework',
    basePathStudent = '/api/student/homework',
    Homework = require('../data/models/homework'),
    Module = require('../data/models/modules'),
    loggedInAsTeacher = require('../middleware/api/loggedInAsTeacher'),
    loggedIn = require('../middleware/api/loggedIn');

module.exports = function(app) {

    /**TEACHER API*/

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
            insert.module = id;
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
                    res.send(homework);
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
        if(req.body.isLive === false || req.body.isLive === true) {
            update.isLive = req.body.isLive;
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
        //Find Module that contains Homework
        Module
            .findOne({homework:id, teacher:teacher})
            .populate({
                path: 'homework',
                match: {_id:id}
            })
            .exec(function(err, module) {
                if(err) {
                    return next(err);
                }
                if(!module) {
                    return res.send('Homework does not exist', 404); //Module not found
                }
                //remove homework from module
                var homework = module.homework[0];
                homework.remove(function(err) {
                    if(err) {
                        return next(err);
                    }
                    res.send('Success', 200)
                })
            });
    });

    /**STUDENT API*/
    //STUDENT GET ALL LIVE HOMEWORK
    app.get(basePathStudent, loggedIn, function(req,res,next) {
        Module
            .find({_id:{$in:req.user.subscribedTo}})
            .distinct('homework')
            .exec(function(err, result) {
                if(err) {
                    return next(err);
                }
                Homework
                    .find({_id:{$in:result},isLive:true})
                    .select('name teacher module')
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

    //STUDENT GET ONE
    app.get(basePathStudent + '/:id', function(req, res, next) {
        var id = req.params.id;
        //Get Homework from DB
        Homework
            .findOne({_id:id})
            .populate('teacher', 'name')
            .exec(function(err,result) {
                if(err) {
                    return next(err);
                }
                var q = result.questions;
                for(var i=0;i< q.length;i++) {
                    var question = {
                        question: q[i].question,
                        answers: []
                    };
                    question.answers.push(q[i].correctAnswer.answer);
                    for(var x=0;x<q[i].otherAnswers.length;x++) {
                        question.answers.push(q[i].otherAnswers[x].answer);
                    }
                    q[i] = question;
                }
                res.send(result);
            });
    });
};
