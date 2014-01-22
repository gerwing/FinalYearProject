
/*
 * Homework API Routes.
 */

var basePathTeacher = '/api/teacher/homework';
var Homework = require('../data/models/homework');

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
           else
                res.send(result);
        });
    });

    //TEACHER POST
    app.post(basePathTeacher, function(req, res) {
        //Function Code
        res.send('POST'); // example
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
            else
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
