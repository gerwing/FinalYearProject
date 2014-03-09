
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
    async = require('async');

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

    //Save Lecture Results
    app.post(basePathStudent + '/:id', loggedIn, function(req,res,next) {
        var id = req.params.id;
        var answers = req.body;
        //Save Lecture Results to Database
        lSubmissions.create({user:req.user.id,lecture:id,results:answers},
            function(err,submission) {
                if(err) {
                    return next(err);
                }
                res.send(submission, 200);
            });

    });
};
