
/*
 * Homework API Routes.
 */

var basePathTeacher = '/api/teacher/homework';
var Homework = require('../data/models/homework');
var Module = require('../data/models/modules');

module.exports = function(app) {

    //TEACHER GET ONE
    app.get(basePathTeacher + '/:id', function(req, res, next) {
        var id = req.params.id;
        var teacher = '1234'; //TODO set teacher id
        //Get Homework from DB
        Homework.findOne({_id:id, teacher:teacher}, function(err,result) {
           if(err) {
               return next(err);
           }
           res.send(result);
        });
    });

    //TEACHER POST
    app.post(basePathTeacher, function(req, res, next) {
        var id = req.body.module;
        var teacher = '1234'; //TODO set teacher id
        //Get Module from DB
        Module.findOne({_id:id, teacher:teacher}, function(err, module) {
            if(err) {
                return next(err);
            }
            //Create Lecture
            Homework.create({name:req.body.name, teacher:teacher}, function(err, homework) {
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
    app.put(basePathTeacher + '/:id', function(req, res, next) {
        var id = req.params.id;
        var teacher = '1234';//TODO set teacher id
        //Check what to update; name or both name and questions
        var update = {name:req.body.name};
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
    app.delete(basePathTeacher + '/:id', function(req, res) {
        var id = req.params.id;
        //Function Code
        res.send('DELETE ' + id); // example
    });
};
