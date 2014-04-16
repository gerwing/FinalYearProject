
/*
 * Lectures API Routes.
 */

var basePathTeacher = '/api/teacher/lectures',
    basePathStudent = '/api/student/lectures',
    Lecture = require('../data/models/lectures'),
    Module = require('../data/models/modules'),
    lSubmissions = require('../data/models/lSubmissions'),
    lStudentIDLists = require('../data/models/lStudentIDLists'),
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
                    res.send(lecture, 201);
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

    //TEACHER GENERATE ACCESS ID
    app.post(basePathTeacher + '/:id/accessID', loggedInAsTeacher, function(req,res,next) {
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
                res.send(lecture,200); //Return lecture
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
                res.send(lecture,200); //Return lecture
            });
        })
    });

    //TEACHER GET sID LIST
    app.get(basePathTeacher + '/:id/sIDList', loggedInAsTeacher, function(req,res,next){
        //Verify ID
        if(!verifyID(req.params.id)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

        var id = req.params.id;
        var teacher = req.user.id;
        //Find sIDList and send result
        lStudentIDLists.findOne({teacher:teacher,lecture:id}, function(err,result){
            if(err) {
                return next(err);
            }
            if(!result) {
                return res.send(result, 200);
            }
            res.send(result.idList);
        });
    });

    //TEACHER GENERATE sID LIST
    app.post(basePathTeacher + '/:id/sIDList', loggedInAsTeacher, function(req,res,next){
        //Verify ID
        if(!verifyID(req.params.id)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

        var id = req.params.id;
        var teacher = req.user.id;
        async.parallel([
            function(done) {
                //Lookup if lecture belongs to teacher
                Lecture.findOne({_id:id,teacher:teacher}, done);
            },
            function(done) {
                //Check for existing sIDLists
                lStudentIDLists.findOne({lecture:id,teacher:teacher}, done);
            }
        ],
        function(err,results){
            if(err) {
                return next(err);
            }
            //Check if lecture belongs to teacher
            if(!results[0]) {
                return res.send({message:"You are not the owner of this lecture"}, 401);
            }
            //Check if no sIDList is already in the database
            if(results[1]) {
                return res.send({message:"You already have a Student ID List for this lecture"}, 400);
            }
            //All ok, generate sIDList
            lStudentIDLists.create({teacher:teacher,lecture:id,accessID:results[0].accessID}, function(err,result){
                if(err) {
                    return next(err);
                }
                res.send(result.idList, 201);
            });
        });
    });

    //TEACHER DELETE sID LIST
    app.delete(basePathTeacher + '/:id/sIDList', loggedInAsTeacher, function(req,res,next){
        //Verify ID
        if(!verifyID(req.params.id)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

        var id = req.params.id;
        var teacher = req.user.id;
        //Remove sIDList entry from database
        lStudentIDLists.remove({teacher:teacher,lecture:id}, function(err){
            if(err) {
                return next(err);
            }
            res.send('Success', 200);
        });
    });

    /**STUDENT API*/
    //STUDENT GET ALL LIVE AND COMPLETED LECTURES
    app.get(basePathStudent, loggedIn, function(req,res,next) {
        var submissions;
        var subscribed;
        async.series([
            function(done) {
                //Find Submitted Lectures
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

    //STUDENT GET ONE LECTURE
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
                //Lookup whether this lecture has already been submitted by the student
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

    //SAVE LECTURE RESULTS
    app.post(basePathStudent + '/:id', loggedIn, function(req,res,next) {
        //Verify ID
        if(!verifyID(req.params.id)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

        var id = req.params.id;
        var answers = req.body;
        async.series([
            function(done) {
                //Check if student has already submitted lecture
                lSubmissions.findOne({user:req.user.id,lecture:id}, function(err,submission){
                    if(err){
                        return done(err);
                    }
                    if(submission) { //Lecture already submitted
                        return done(409);
                    }
                    done();
                });
            },
            function(done) {
                //Lookup lecture and insert results
                Lecture.findOne({_id:id}, function(err, lecture) {
                    if(err) {
                        return done(err);
                    }
                    if(!lecture) {
                        return done(404); //Lecture not found
                    }
                    //Check if student is subscribed to module from lecture
                    //If he is not, throw error and remove submission
                    if(req.user.subscribedTo.indexOf(lecture.module)===-1) {
                        return done(400);
                    }
                    //Save Lecture Statistics
                    saveLectureStatistics(lecture,answers,done);
                });
            },
            function(done) {
                //Save Lecture Results to Database
                lSubmissions.create({user:req.user.id,lecture:id,results:answers},done);
            }
        ],
        function(err,results) {
            if(err === 409) {
                return res.send({message:'Lecture has already been submitted'}, 409);
            }
            else if(err === 404) {
                return res.send({message:'Lecture was not found'}, 404);
            }
            else if(err === 400) {
                return res.send({message:'You are not subscribed to this lecture'}, 400);
            }
            else if(err) {
                return next(err);
            }
            res.send(results[2], 201); //Send back submission result
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
                //Verify if lecture does not require sID access
                lStudentIDLists.findOne({lecture:lecture.id}, function(err,result){
                    if(err) {
                        return next(err);
                    }
                    if(result) { //Lecture requires sID access
                        return res.send({message:"This lecture requires a Student ID"}, 401);
                    }
                    res.send(lecture);
                });
            });
    });

    //SAVE LECTURE RESULTS USING ACCESS ID
    app.post(basePathStudent + '/aid/:id', function(req,res,next) {
        var id = req.params.id;
        var answers = req.body;
        //Lookup lecture and add results
        //Only allow live lectures to be updated
        async.series([
            function(done){
                //Check whether Lecture does not require Student ID
                lStudentIDLists.findOne({accessID:id}, function(err,result){
                    if(err) {
                        return done(err);
                    }
                    if(result) { //Lecture requires Student ID
                        return done(401);
                    }
                    done();
                });
            },
            function(done){
                Lecture.findOne({accessID:id,isLive:true}, function(err, lecture) {
                    if(err) {
                        return done(err);
                    }
                    if(!lecture) {
                        return done(404); //Lecture not found
                    }
                    //Save Lecture Statistics
                    saveLectureStatistics(lecture,answers,done);
                });
            }
        ],
        function(err){
            if(err === 401) {
                return res.send({message:'Lecture requires a Student ID'}, 401);
            }
            else if(err === 404) {
                return res.send({message:'Lecture was not found'}, 404);
            }
            else if(err) {
                return next(err);
            }
            //Everything Successful
            res.send('Success', 201);
        });
    });

    //STUDENT VERIFY ACCESS ID AND STUDENT ID COMBO
    app.get(basePathStudent + '/aid/:aid/:sid/verify', function(req,res,next) {
        var aid = req.params.aid;
        var sid = req.params.sid;
        //Lookup lecture
        Lecture
            .findOne({accessID:aid, isLive:true})
            .exec(function(err, lecture) {
                if(err) {
                    return next(err);
                }
                if(!lecture) {
                    return res.send({message: 'The lecture you were trying to find does not exist'}, 404);
                }
                //Verify Student ID
                lStudentIDLists.findOne({lecture:lecture.id, 'idList.sid':sid}, function(err,result){
                    if(err) {
                        return next(err);
                    }
                    if(!result) {
                        return res.send({message:'The Student ID you tried was not found for this lecture'}, 401);
                    }
                    res.send('Success',200);
                });
            });
    });

    //STUDENT GET A LIVE LECTURE USING ACCESS ID AND STUDENT ID
    app.get(basePathStudent + '/aid/:aid/:sid', function(req,res,next) {
        var aid = req.params.aid;
        var sid = req.params.sid;
        //Lookup lecture
        Lecture
            .findOne({accessID:aid, isLive:true})
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
                //Verify Student ID
                lStudentIDLists.findOne({lecture:lecture.id, 'idList.sid':sid}, {'idList.$':1}, function(err,result){
                    if(err) {
                        return next(err);
                    }
                    //SID was not found
                    if(!result) {
                        return res.send({message:'The Student ID you tried was not found for this lecture'}, 401);
                    }
                    if(result.idList[0].used) {
                        return res.send({message:'You already used this Student ID'}, 401);
                    }
                    result.idList[0].used = true;
                    //save
                    result.save(function(err){
                        if(err) {
                            return next(err);
                        }
                        //Send Lecture
                        res.send(lecture);
                    });

                });
            });
    });

    //SAVE LECTURE RESULTS USING ACCESS ID AND STUDENT ID
    app.post(basePathStudent + '/aid/:aid/:sid', function(req,res,next) {
        var aid = req.params.aid;
        var sid = req.params.sid;
        var answers = req.body;
        //Lookup lecture and add results
        //Only allow live lectures to be updated
        async.series([
            function(done){
                //Check whether Lecture does not require Student ID by trying to remove Student ID
                lStudentIDLists.update({accessID:aid},{$pull: { idList: {sid:sid} } }, function(err,res){
                    if(err) {
                        return done(err);
                    }
                    if(res===1){  //Student ID was valid and got removed
                        done();
                    }
                    else  {  //Student ID was not valid
                        return done(401);
                    }
                });
            },
            function(done){
                Lecture.findOne({accessID:aid,isLive:true}, function(err, lecture) {
                    if(err) {
                        return done(err);
                    }
                    if(!lecture) {
                        return done(404); //Lecture not found
                    }
                    //Save Lecture Statistics
                    saveLectureStatistics(lecture,answers,done);
                });
            }
        ],
            function(err){
                if(err === 401) {
                    return res.send({message:'The Student ID you entered is not valid'}, 401);
                }
                else if(err === 404) {
                    return res.send({message:'Lecture not found'}, 404);
                }
                else if(err) {
                    return next(err);
                }
                //Everything Successful
                res.send('Success', 201);
            });
    });
};

/**
 *  OTHER METHODS
 */
//Save Statistics
var saveLectureStatistics = function(lecture,answers,callback) {
    //Get Lecture ID
    var id = lecture.id;

    //Update Lecture statistics
    for(var i=0;i<answers.length;i++) {
        //Update times right or wrong
        if(answers[i].correct === true) {
            Lecture.update(
                {_id:id, 'questions.question':answers[i].question},
                {$inc: {'questions.$.timesRight':1} }
            ).exec();
        }
        else if(answers[i].correct === false) {
            Lecture.update(
                {_id:id, 'questions.question':answers[i].question},
                {$inc: {'questions.$.timesWrong':1} }
            ).exec();
        }
        //Update times question was answered
        var data = {};
        data['questions.'+i+'.answers.$.timesAnswered'] = 1;
        var data1 = {};
        data1['questions.'+i+'.answers.answer'] = answers[i].answer;
        data1['_id'] = id;
        Lecture.update(
            data1,
            {$inc: data}
        ).exec();
    }
    //Update times lecture was done
    Lecture.update({_id:id},{$inc: {'timesDone':1} }).exec();
    //Callback with no errors
    callback(null);
};
