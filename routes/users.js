/*
 * User routes
 */
var User = require('../data/models/users'),
    Module = require('../data/models/modules'),
    loggedIn = require('../middleware/api/loggedIn'),
    nodemailer = require('../config/nodemailer'),
    verificationTokens = require('../data/models/verificationTokens'),
    ejs = require('ejs'),
    async = require('async');

module.exports = function(app) {
    /**TEACHER API*/
    //REGISTER TEACHER
    app.post('/api/teacher/register', function(req,res,next) {
        //Mark as teacher
        var newTeacher = req.body;
        newTeacher.isTeacher = true;
        //Register Teacher
        User.create(newTeacher, function(err, user) {
            if(err) {
                //Username already taken
                if(err.code === 11000) {
                    res.send({message:'Your chosen username is already taken'}, 409);
                }
                else if(err.name === 'ValidationError') {
                    return res.send(Object.keys(err.errors).map(function(errField){
                        return err.errors[errField].message;
                    }).join('. '), 406);
                }
                else {
                    next(err);
                }
                return;
            }
            //Send verification email
            sendVerificationEmail(user,req,res, function(err) {
                if(err) {
                    return next(err);
                }
                res.send(user, 201);
            });
        });
    });

    //UPDATE TEACHER
    //TODO complete
    app.put('/api/teacher/:id', function(req,res) {
        //Update Teacher Account
    });

    //DELETE TEACHER
    //TODO complete
    app.delete('/api/teacher/:id', function(req,res) {
        //Delete Teacher Account
    });

    /**STUDENT API*/
    //REGISTER STUDENT
    app.post('/api/student/register', function(req,res,next) {
        var newStudent = req.body;
        //Mark as student
        newStudent.isTeacher = false;
        newStudent.name = "Student";
        newStudent.email = newStudent.username;
        //Register Student
        User.create(newStudent, function(err, user) {
            if(err) {
                //Username already taken
                if(err.code === 11000) {
                    res.send({message:'You already registered with that email'}, 409);
                }
                else if(err.name === 'ValidationError') {
                    return res.send(Object.keys(err.errors).map(function(errField){
                        return err.errors[errField].message;
                    }).join('. '), 406);
                }
                else {
                    next(err);
                }
                return;
            }
            //Send verification email
            sendVerificationEmail(user,req,res, function(err) {
                if(err) {
                    return next(err);
                }
                res.send(user, 201);
            });
        });
    });

    //DELETE Student
    //TODO complete
    app.delete('/api/student/:id', function(req,res) {
        //Delete Student Account
    });

    //GET ALL MODULES SUBSCRIBED TO
    app.get('/api/student/subscribed', loggedIn, function(req,res,next) {
        Module
            .find({_id:{$in:req.user.subscribedTo}})
            .populate('teacher','name')
            .select('name teacher')
            .exec(function(err,modules) {
                if(err) {
                    return next(err);
                }
                res.send(modules);
            });
    });

    //SUBSCRIBE TO MODULE
    app.post('/api/student/subscribe', loggedIn, function(req,res,next) {
        var id = req.body.id;
        var user = req.user;
        if(!id){ //Make sure ID is initialized
            id = "";
        }
        //Lookup module and if it exists, add it to user subscriptions
        Module.findOne({shortId:id}, function(err, module) {
            if(err) {
                return next(err);
            }
            if(!module) {
                return res.send({message:'Module does not exist'}, 404); //Module not found
            }
            //Module has email restrictions applied to it, check restrictions
            var restrictions = module.emailRestrictions;
            var email = req.user.email;
            if(restrictions.length > 0) {
                var allowed = false;
                for(var i=0;i<restrictions.length;i++) {
                    if(email.lastIndexOf(restrictions[i]) >= 0) {
                        allowed = true;
                    }
                }
                if(!allowed) {
                    return res.send({message:'You are not allowed to join this module'}, 401);
                }
            }
            if(!user.subscribedTo) {
                user.subscribedTo = new Array();
            }
            if(user.subscribedTo.indexOf(module.id)>=0) {
                return res.send({message:'You are already subscribed to that module'}, 409); //Module already subscribed
            }
            user.subscribedTo.push(module.id);
            user.save(function(err) {
                if(err) {
                    return next(err);
                }
                res.send(user, 200);
            });
        })
    });

    //UNSUBSCRIBE TO MODULE
    app.post('/api/student/unsubscribe', loggedIn, function(req,res,next) {
        var id = req.body.id;
        var user = req.user;
        //Remove Module from user object
        user.subscribedTo.splice(user.subscribedTo.indexOf(id),1);
        user.save(function(err) {
            if(err) {
                return next(err);
            }
            res.send(user, 200);
        })
    });

    //RESEND VERIFICATION EMAIL
    //THIS METHOD MUST BE BEFORE THE VERIFY METHOD IN ORDER TO CATCH THIS FIRST
    app.post('/api/user/verify/resend', function(req,res,next) {
        var id = req.body.user;
        var user = {};
        async.series([
            function(done) {
                //Lookup existing tokens
                verificationTokens.findOne({user:id}, function(err, result) {
                    if(err) {
                        return done(err);
                    }
                    //If token was found remove it
                    if(result) {
                        result.remove(done);
                    }
                    else{
                        done(null);
                    };
                });
            },
            function(done) {
                User.findOne({_id:id}, function(err, result) {
                    if(err) {
                        return done(err);
                    }
                    if(!result) {
                        res.send({message:'User could not be found'}, 404);
                        return done(true);
                    }
                    user = result;
                    done(null);
                });
            },
            function(done) {
                //Send Verification Email
                sendVerificationEmail(user,req,res,done);
            }
        ],
        function(err,results) {
            if(err) {
                if(err === true) {
                    return;
                }
                return next(err);
            }
            res.send('Success', 200);
        });

    });

    //VERIFY USER ACCOUNT
    app.post('/api/user/verify/:token', function(req,res,next) {
        var token = req.params.token;
        //Lookup Token
        verificationTokens.findOne({token:token}, function(err, result) {
            if(err) {
                return next(err);
            }
            if(!result) {
                return res.send({message:"Token was not found"}, 404);
            }
            User.findOne({_id:result.user}, function(err, user) {
                if(err) {
                    return next(err);
                }
                if(user) {
                    user.verified = true;
                    user.save(function(err) {
                        if(err) {
                            return next(err);
                        }
                        res.send(user, 200);
                    });
                }
                else {
                    return res.send({message:"User was not found"}, 404);
                }
            });
        });
    });
};

//Email used to send verification email
function sendVerificationEmail(user, req, res, next) {
    //Add verificationToken entry for user
    verificationTokens.create({user:user._id, token:"default"}, function(err,result) {
        if (err) {
            return next(err);
        }
        //Generate email and text bodies
        var options = {
            email: user.email,
            name: user.name,
            verifyURL: req.protocol + "://" + req.get('host') + "/verify/" + result.token
        };
        var subject = "Please verify your account";
        ejs.renderFile("views/verifyEmail-text.ejs", options, function (err, textBody) {
            if (err) {
                return next(err);
            }
            ejs.renderFile("views/verifyEmail-html.ejs", options, function (err, htmlBody) {
                if (err) {
                    return next(err);
                }
                //Send confirmation mail
                nodemailer.sendEmail(user.email, subject, textBody, htmlBody);
                //Callback
                next(null);
            });
        });
    });
};