
/*
 * Lectures API Routes.
 */

var basePathTeacher = '/api/teacher/lectures',
    basePathStudent = '/api/student/lectures',
    Lecture = require('../data/models/lectures'),
    Module = require('../data/models/modules'),
    lSubmissions = require('../data/models/lSubmissions'),
    loggedInAsTeacher = require('../middleware/api/loggedInAsTeacher'),
    loggedIn = require('../middleware/api/loggedIn'),
    async = require('async'),
    verifyID = require('../data/verifyMongoID');

module.exports = function(app) {

    //TEACHER GET ONE
    app.get(basePathTeacher + '/:id', loggedInAsTeacher, function(req, res, next) {
        //Verify ID
        if(!verifyID(req.params.id)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

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
                return next(err); //Server error
            }
            if(!module) {
                return res.send({message:'Module does not exist'}, 404); //Module not found
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

    //TEACHER GENERATE ACCESS ID
    app.put(basePathTeacher + '/:id/accessID', loggedInAsTeacher, function(req,res,next) {
        //Verify ID
        if(!verifyID(req.params.id)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

        var id = req.params.id;
        var teacher = req.user.id;
        //Find Lecture
        Lecture.findOne({_id:id,teacher:teacher}, function(err,lecture) {
            if(err) {
                return next(err);
            }
            lecture.generateAccessID(function() {
                res.send('Success',200);
            });
        })
    });

    //TEACHER REMOVE ACCESS ID
    app.delete(basePathTeacher + '/:id/accessID', loggedInAsTeacher, function(req,res,next) {
        //Verify ID
        if(!verifyID(req.params.id)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

        var id = req.params.id;
        var teacher = req.user.id;
        //Find Lecture
        Lecture.findOne({_id:id,teacher:teacher}, function(err,lecture) {
            if(err) {
                return next(err);
            }
            lecture.removeAccessID(function() {
                res.send('Success',200);
            });
        })
    });

    //TEACHER DELETE
    app.delete(basePathTeacher + '/:id', loggedInAsTeacher, function(req, res, next) {
        //Verify ID
        if(!verifyID(req.params.id)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

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
                    return res.send({message:'Lecture does not exist'}, 404); //Module not found
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
        var submissions;
        var subscribed;
        async.series([
            function(done) {
                //Find Submitted Homework
                lSubmissions
                    .find({user:req.user.id})
                    .distinct('lecture')
                    .exec(function(err,results) {
                        if(err) {
                            return done(err);
                        }
                        submissions = results;
                        done();
                    });
            },
            function(done) {
                Lecture
                    .find({_id:{$in:submissions}})
                    .select('name teacher module')
                    .populate('teacher','name')
                    .populate('module','name')
                    .sort('+module.name')
                    .exec(done);
            },
            function(done) {
                //Find live lectures
                Module
                    .find({_id:{$in:req.user.subscribedTo}})
                    .distinct('lectures')
                    .exec(function(err, results) {
                        if(err) {
                            return done(err);
                        }
                        subscribed = results;
                        done();
                    });
            },
            function(done) {
                Lecture
                    .find({_id:{$in:subscribed},isLive:true})
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
            //Send both available and completed lectures
            res.send({completed:results[1],available:results[3]});
        });
    });

    //STUDENT GET ONE LIVE LECTURE
    app.get(basePathStudent + '/:id', loggedIn, function(req,res,next) {
        //Verify ID
        if(!verifyID(req.params.id)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

        var id = req.params.id;
        async.parallel([
            function(done) {
                //Get Lecture from DB
                Lecture
                    .findOne({_id:id})
                    .populate('teacher', 'name')
                    .populate('module', 'name')
                    .select('module teacher questions.question questions.answers.answer name') //Avoid sending correct answer info
                    .exec(done);
            },
            function(done) {
                //Lookup whether this homework has already been submitted by the student
                lSubmissions.findOne({lecture:id,user:req.user.id}, done);
            }
        ],
        function(err,results) {
            if(err) {
                return next(err);
            }
            //Lecture has already been submitted
            if(results[1]) {
                results[0] = results[0].toObject();
                results[0].submission = results[1];
            }
            //Send results
            res.send(results[0]);
        });
    });

    //STUDENT GET A LIVE LECTURE USING ACCESS ID
    app.get(basePathStudent + '/aid/:id', function(req,res,next) {
        var id = req.params.id;
        //Lookup lecture
        Lecture
            .findOne({accessID:id, isLive:true})
            .populate('teacher', 'name')
            .populate('module', 'name')
            .select('module teacher questions.question questions.answers.answer name') //Avoid sending correct answer info
            .exec(function(err, lecture) {
                if(err) {
                    return next(err);
                }
                if(!lecture) {
                    return res.send({message: 'The lecture you were trying to find does not exist'}, 404);
                }
                res.send(lecture);
            });
    });

    //SAVE LECTURE RESULTS
    app.post(basePathStudent + '/:id', loggedIn, function(req,res,next) {
        //Verify ID
        if(!verifyID(req.params.id)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

        var id = req.params.id;
        var answers = req.body;
        async.parallel([
            function(done) {
                //Save Lecture Results to Database
                lSubmissions.create({user:req.user.id,lecture:id,results:answers},done);
            },
            function(done) {
                Lecture.findOne({_id:id}, function(err, lecture) {
                    if(err) {
                        return done(err);
                    }
                    lecture.timesDone +=1;
                    var questions = lecture.questions;
                    //Check which questions were answered
                    for(var i=0;i<questions.length;i++) {
                        for(var y=0;y<answers.length;y++) {
                            if(questions[i].question === answers[y].question) {
                                //Check result
                                for(var x=0;x<questions[i].answers.length;x++) {
                                    if(questions[i].answers[x].answer === answers[y].answer){
                                        questions[i].answers[x].timesAnswered += 1;
                                        break;
                                    }
                                }
                                //Remove answer from array and into result array
                                answers.splice(y,1);
                                break;
                            }
                        }
                    }
                    lecture.save(function(err) {
                        if(err) {
                            return done(err);
                        }
                        done(null);
                    });
                });
            }
        ],
        function(err,results) {
            if(err) {
                return next(err);
            }
            res.send(results[0], 200); //Send back submission result
        });
    });

    //SAVE LECTURE RESULTS USING ACCESS ID
    app.post(basePathStudent + '/aid/:id', function(req,res,next) {
        var id = req.params.id;
        var answers = req.body;
        //Lookup lecture and add results
        //Only allow live lectures to be updated
        Lecture.findOne({accessID:id,isLive:true}, function(err, lecture) {
            if(err) {
                return next(err);
            }
            if(!lecture) {
                return res.send({message:'Lecture not found'}, 404);
            }
            lecture.timesDone +=1;
            var questions = lecture.questions;
            //Check which questions were answered
            for(var i=0;i<questions.length;i++) {
                for(var y=0;y<answers.length;y++) {
                    if(questions[i].question === answers[y].question) {
                        //Check result
                        for(var x=0;x<questions[i].answers.length;x++) {
                            if(questions[i].answers[x].answer === answers[y].answer){
                                questions[i].answers[x].timesAnswered += 1;
                                break;
                            }
                        }
                        //Remove answer from array and into result array
                        answers.splice(y,1);
                        break;
                    }
                }
            }
            lecture.save(function(err) {
                if(err) {
                    return next(err);
                }
                res.send('Success', 200);
            });
        });
    });
};
