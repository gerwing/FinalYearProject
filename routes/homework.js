
/*
 * Homework API Routes.
 */

var basePathTeacher = '/api/teacher/homework',
    basePathStudent = '/api/student/homework',
    Homework = require('../data/models/homework'),
    hSubmissions = require('../data/models/hSubmissions'),
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
                    .populate('teacher','name')
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
    app.get(basePathStudent + '/:id', loggedIn, function(req, res, next) {
        var id = req.params.id;
        //Get Homework from DB
        Homework
            .findOne({_id:id})
            .populate('teacher', 'name')
            .populate('module', 'name')
            .select('module teacher questions.question questions.answers.answer name') //Avoid sending correct answer info
            .exec(function(err,homework) {
                if(err) {
                    return next(err);
                }
                res.send(homework);
            });
    });

    //STUDENT SUBMIT HOMEWORK
    app.post(basePathStudent + '/:id', loggedIn, function(req,res,next) {
        var id = req.params.id;
        var answers = req.body;
        //Get Homework from DB
        Homework.findOne({_id:id}, function(err,homework) {
            if(err) {
                return next(err);
            }
            var questions = homework.questions; //questions array
            var results = []; //result array
            //Check which questions were correct and which were false
            for(var i=0;i<questions.length;i++) {
                for(var y=0;y<answers.length;y++) {
                    if(questions[i].question === answers[y].question) {
                        //Check result
                        for(var x=0;x<questions[i].answers.length;x++) {
                            if(questions[i].answers[x].answer === answers[y].answer){
                                if(questions[i].answers[x].correct) {
                                    answers[y].correct = true;
                                }
                                else {
                                    answers[y].correct = false;
                                }
                                //Set times answered
                                questions[i].answers[x].timesAnswered += 1;
                                break;
                            }
                        }
                        //Remove answer from array and into result array
                        results.push(answers.splice(y,1)[0]);
                        break;
                    }
                }
            }
            homework.timesDone +=1; //Set homework as done one more time
            homework.save(function(err) {
                if(err) {
                    return next(err);
                }
                //Save Submission
                hSubmissions.create({user:req.user.id,homework:homework.id,results:results},
                    function(err) {
                        if(err) {
                            return next(err);
                        }
                        //Send Results
                        res.send(results, 200);
                    });
            });
        });
    });
};
