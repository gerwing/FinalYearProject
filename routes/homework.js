
/*
 * Homework API Routes.
 */

var basePathTeacher = '/api/teacher/homework',
    basePathStudent = '/api/student/homework',
    Homework = require('../data/models/homework'),
    hSubmissions = require('../data/models/hSubmissions'),
    Module = require('../data/models/modules'),
    loggedInAsTeacher = require('../middleware/api/loggedInAsTeacher'),
    loggedIn = require('../middleware/api/loggedIn'),
    async = require('async'),
    verifyID = require('../data/verifyMongoID');

module.exports = function(app) {

    /**TEACHER API*/

    //TEACHER GET ONE
    app.get(basePathTeacher + '/:id', loggedInAsTeacher, function(req, res, next) {
        //Verify ID
        if(!verifyID(req.params.id)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

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
        //Verify module id exists
        if(!req.body.module) {
            return res.send({message:'It is required to include the module ID'}, 406); //no module ID
        }
        //Verify ID
        if(!verifyID(req.body.module)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

        var id = req.body.module;
        var teacher = req.user.id;
        //Get Module from DB
        Module.findOne({_id:id, teacher:teacher}, function(err, module) {
            if(err) {
                return next(err);
            }
            if(!module) {
                return res.send({message:'Module does not exist'}, 404); //Module not found
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
        //Verify ID
        if(!verifyID(req.params.id)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

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
        //Verify ID
        if(!verifyID(req.params.id)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

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
                    return res.send({message:'Homework does not exist'}, 404); //Module not found
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
    //STUDENT GET ALL LIVE OR SUBMITTED HOMEWORK
    app.get(basePathStudent, loggedIn, function(req,res,next) {
        var submissions;
        var subscribed;
        async.series([
            function(done) {
                //Find Submitted Homework
                hSubmissions
                    .find({user:req.user.id})
                    .distinct('homework')
                    .exec(function(err,results) {
                        if(err) {
                            return done(err);
                        }
                        submissions = results;
                        done();
                    });
            },
            function(done) {
                Homework
                    .find({_id:{$in:submissions}})
                    .select('name teacher module')
                    .populate('teacher','name')
                    .populate('module','name')
                    .sort('+module.name')
                    .exec(done);
            },
            function(done) {
                //Find non submitted homework
                Module
                    .find({_id:{$in:req.user.subscribedTo}})
                    .distinct('homework')
                    .exec(function(err, results) {
                        if(err) {
                            return done(err);
                        }
                        subscribed = results;
                        done();
                    });
            },
            function(done) {
                Homework
                    .find({_id:{$in:subscribed,$nin:submissions},isLive:true})
                    .select('name teacher module')
                    .populate('teacher','name')
                    .populate('module','name')
                    .sort('+module.name')
                    .exec(done);
            }
        ],
        function(err,results) {
            if(err) {
                return next(err);
            }
            //Send both available and completed homework
            res.send({completed:results[1],available:results[3]});
        });
    });

    //STUDENT GET ONE
    app.get(basePathStudent + '/:id', loggedIn, function(req, res, next) {
        //Verify ID
        if(!verifyID(req.params.id)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

        var id = req.params.id;
        async.parallel([
            function(done) {
                //Get Homework from DB
                Homework
                    .findOne({_id:id})
                    .populate('teacher', 'name')
                    .populate('module', 'name')
                    .select('module teacher questions.question questions.answers.answer name') //Avoid sending correct answer info
                    .exec(done);
            },
            function(done) {
                //Lookup whether this homework has already been submitted by the student
                hSubmissions.findOne({homework:id,user:req.user.id}, done);
            }
        ],
        function(err,results) {
            if(err) {
                return next(err);
            }
            //Homework has already been submitted
            if(results[1]) {
                results[0] = results[0].toObject();
                results[0].submission = results[1];
            }
            //Send results
            res.send(results[0]);
        });
    });

    //STUDENT SUBMIT HOMEWORK
    app.post(basePathStudent + '/:id', loggedIn, function(req,res,next) {
        //Verify ID
        if(!verifyID(req.params.id)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

        var id = req.params.id;
        var answers = req.body;
        var resultList = [];
        async.series([
            function(done) {
                //Check whether homework has already been submitted
                hSubmissions.findOne({user:req.user,homework:id}, function(err,submission) {
                    if(err) {
                        return done(err);
                    }
                    if(submission) {
                        return done(409);
                    }
                    else {
                        done();
                    }
                });
            },
            function(done) {
                //Get Homework from DB
                Homework.findOne({_id:id}, function(err,homework) {
                    if(err) {
                        return done(err);
                    }
                    //Check if student is subscribed to module from homework
                    //If he is not, throw error and remove submission
                    if(req.user.subscribedTo.indexOf(homework.module)===-1) {
                        return done(400);
                    }
                    var questions = homework.questions; //questions array
                    //Check which questions were correct and which were false
                    for(var i=0;i<questions.length;i++) {
                        for(var y=0;y<answers.length;y++) {
                            if(questions[i].question === answers[y].question) {
                                //Check result
                                for(var x=0;x<questions[i].answers.length;x++) {
                                    if(questions[i].answers[x].answer === answers[y].answer){
                                        if(questions[i].answers[x].correct) {
                                            answers[y].correct = true;
                                            questions[i].timesRight+=1;
                                        }
                                        else {
                                            answers[y].correct = false;
                                            questions[i].timesWrong+=1;
                                        }
                                        //Set times answered
                                        questions[i].answers[x].timesAnswered += 1;
                                        break;
                                    }
                                }
                                //Remove answer from array and into result array
                                resultList.push(answers.splice(y,1)[0]);
                                break;
                            }
                        }
                    }
                    homework.timesDone +=1; //Set homework as done one more time
                    homework.save(function(err) {
                        if(err) {
                            return done(err);
                        }
                        //Save Submission
                        hSubmissions.create({user:req.user.id,homework:homework.id,results:resultList},done);
                    });
                });
            }
        ],
        function(err,results) {
            if(err === 409) {
                return res.send({message:'Homework has already been submitted'}, 409);
            }
            else if(err === 400) {
                return res.send({message:'You are not subscribed to this homework'}, 400);
            }
            else if(err) {
                return next(err);
            }
            res.send(results[1], 201); //send submission
        });
    });
};
