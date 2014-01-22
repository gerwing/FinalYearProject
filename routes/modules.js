
/*
 * Module API Routes.
 */

var Module = require('../data/models/modules');
var basePath = '/api/modules';

module.exports = function(app) {

    //GET ALL
	app.get(basePath, function(req, res, next) {
        var teacher = '1234'; //TODO set teacher id
        //Get Modules from Database, Include only name and id
        Module.find({teacher:teacher}, 'name _id', function(err, results) {
           if(err) {
               return next(err);
           }
           else
               res.send(results);
        });
	});

    //GET ONE
    //TODO populate homework and lectures with name and id
    app.get(basePath + '/:id', function(req, res, next) {
        var id = req.params.id;
        var teacher = '1234'; //Todo set teacher id
        //Get Module from Database
        Module.findOne({_id:id, teacher:teacher}, function(err,result){
           if(err) {
               return next(err);
           }
           else
               res.send(result);
        });
    });

    //POST
    app.post(basePath, function(req, res, next) {
        var module = req.body;
        module.teacher = '1234'; //TODO set teacher id
        //Save Module to DB
        Module.create(module, function(err) {
            if(err) {
                return next(err);
            }
            else
                res.send('Success', 200);
        });
    });

    //PUT
    app.put(basePath + '/:id', function(req, res, next) {
        var id = req.params.id;
        var teacher = '1234';//TODO set teacher id
        //Update Module in Database
        Module.update({_id:id, teacher:teacher}, {name:req.body.name}, function(err){
           if(err) {
               return next(err);
           }
           else
               res.send('Success', 200);
        });
    });

    //DELETE
    //TODO Remove Lectures and Homework that were linked to Module
    app.delete(basePath + '/:id', function(req, res, next) {
        var id = req.params.id;
        var teacher = '1234'; //TODO set teacher id
        //Delete Module in database
        Module.remove({_id:id, teacher:teacher}, function(err) {
            if(err) {
                return next(err);
            }
            else
                res.send('Success', 200);
        })
    });
};
