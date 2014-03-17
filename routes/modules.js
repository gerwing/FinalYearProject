
/*
 * Module API Routes.
 */

var basePathTeacher = '/api/teacher/modules',
    basePathStudent = '/api/student/modules',
    Module = require('../data/models/modules'),
    Lecture = require('../data/models/lectures'),
    Homework = require('../data/models/homework'),
    User = require('../data/models/users'),
    loggedInAsTeacher = require('../middleware/api/loggedInAsTeacher'),
    loggedIn = require('../middleware/api/loggedIn'),
    verifyID = require('../data/verifyMongoID');

module.exports = function(app) {

    /** TEACHER API */
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
        //Verify ID
        if(!verifyID(req.params.id)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

        var id = req.params.id;
        var teacher = req.user.id;
        //Get Module from Database
        Module
            .findOne({_id:id, teacher:teacher})
            .populate('lectures', 'name _id isLive')
            .populate('homework', 'name _id isLive')
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
        //Verify ID
        if(!verifyID(req.params.id)){
            return res.send({message:"The ID you entered is not a valid ID"}, 400);
        };

        var id = req.params.id;
        var teacher = req.user.id;
        var name = req.body.name;
        var emailRestrictions = req.body.emailRestrictions;
        var update = {};
        //Check if name is valid
        if(name) {
            update.name = name;
        }
        //Check email restrictions
        if(emailRestrictions) {
            update.emailRestrictions = emailRestrictions;
        }
        //Update Module in Database
        Module.update({_id:id, teacher:teacher}, update, function(err){
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

    /** STUDENT API */
    app.get(basePathStudent + '/search', loggedIn, function(req,res,next) {
        var name = req.query.name;
        var query = { name: { $regex: '.*'+ name +'.*', $options: 'i' } };
        if(name) {
            Module
                .find(query)
                .select('name teacher shortId')
                .populate('teacher','name')
                .exec(function(err, results) {
                    if(err) {
                        return next(err);
                    }
                    res.send(results);
                });
        }
        else {
            res.send('Success', 200);
        }
    });
};
