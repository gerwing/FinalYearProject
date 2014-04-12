/*
 *  Socket IO Configuration for Live Lectures
 */
var redis  = require('redis'),
    redisConfig = require('config').Redis,
    sessionConfig = require('config').Session,
    RedisStore = require('socket.io/lib/stores/redis'),
    passportSocketIo = require('passport.socketio'),
    express = require('express'),
    pub = redis.createClient(redisConfig.port, redisConfig.host),
    sub = redis.createClient(redisConfig.port, redisConfig.host),
    client = redis.createClient(redisConfig.port, redisConfig.host),
    Lecture = require('../data/models/lectures');

module.exports = function(io, sessionStore, passport) {

    //Configure Redis
    pub.auth(redisConfig.password, function (err) { if (err) throw err; });
    sub.auth(redisConfig.password, function (err) { if (err) throw err; });
    client.auth(redisConfig.password, function (err) { if (err) throw err; });

    //Initialize Redis Session
    io.set('store', new RedisStore({
        redis: redis,
        redisPub: pub,
        redisSub: sub,
        redisClient: client
    }));

    //Initialize Socket.io authorization
    io.set('authorization', passportSocketIo.authorize({
        cookieParser: express.cookieParser,
        key: 'connect.sid',
        secret: sessionConfig.secret, //session secret from config
        store: sessionStore , //redis session store
        passport: passport,
        fail: function(data, message, error, accept) {
            accept(null,true); //always accept connections, otherwise aID lectures wouldn't work
        }
    }));

    //Configure Events
    io.sockets.on('connection', function (socket) {
        //Student answers
        socket.on('answer', function (data) {
            socket.get('room',function(err,room) {
                if(err) {
                    throw err;
                }
                client.get('t'+room, function(err,teacher) { //Get teacher for room
                    io.sockets.socket(teacher).emit('newAnswer', data); //Send answer to lecturer
                });
                console.log('answered ' + data);
            });
        });
        //Lecturer goes to next question
        socket.on('changeQuestion', function(data) {
            socket.get('room', function(err,room) {
                if(err) {
                    throw err;
                }
                client.set('q'+room,data); //Set current question in redis
                socket.broadcast.to(room).emit('gotoQuestion', data); //Send question number to students
                console.log('Go to question ' + data);
            });
        });
        //Lecture shows results
        socket.on('results', function(data) {
            socket.get('room', function(err,room) {
                if(err) {
                    throw err;
                }
                socket.broadcast.to(room).emit('showResults', data); //Send right answer to students
                console.log('Answer is ' + data);
            });
        });
        //Lecture has finished
        socket.on('finished', function() {
            socket.get('room', function(err,room) {
                if(err) {
                    throw err;
                }
                socket.broadcast.to(room).emit('finish');
                console.log('Lecture Finished');
            });
        });

        //Teacher starts lecture
        socket.on('joinTeacher', function(room){
            //Verify teacher owns lecture
            Lecture.findOne({_id:room,teacher:socket.handshake.user.id}, function(err,result){
                if(err) {
                    throw err;
                }
                if(!result) { //teacher does not own lecture
                    console.log("Teacher connection refused");
                    return;
                }
                else {
                    socket.join(room); //join the lectue
                    client.set('q'+room, 0);  //set current question to 0 if not set yet
                    client.set('t'+room,socket.id); //set socket id as teacher in redis
                    //Set room name on socket
                    socket.set('room',room,function(err) {
                        if(err) {
                            throw err;
                        }
                        console.log('Teacher joined lecture ' + room);
                    });
                }
            });
        });

        //Student joins Lecture room
        socket.on('joinStudent', function(room) {
            //User is logged in
            if(socket.handshake.user.logged_in) {
                var id = socket.handshake.user.id;
                client.get("u"+id, function(err,res){
                    if(err){
                        throw err;
                    }
                    if(res) { //Student already checked in
                        console.log("Student connection refused");
                        socket.emit('conflict');
                        return;
                    }
                    client.set("u"+id,"checked"); //Checkin student
                    client.expire("u"+id, 60*30); //Set TTL to half hour

                    socket.join(room); //join the lecture
                    //Get lecture status
                    client.get('q'+room, function(err,question){  //Get current question for lecture
                        client.get('t'+room, function(err,teacher){ //get teacher from redis
                            io.sockets.socket(teacher).emit('studentConnect'); //Send connect notice to lecturer
                            socket.emit('gotoQuestion', question); //Send student to current question
                        });
                    });
                    //Set room name on socket
                    socket.set('room',room,function(err) {
                        if(err) {
                            throw err;
                        }
                        console.log('Student joined lecture ' + room);
                    });
                    //Set user ID on socket
                    socket.set('user',id,function(err) {
                        if(err) {
                            throw err;
                        }
                    });
                });
            }

            //User is not logged in => aID lecture
            else {
                Lecture.findOne({_id:room,isLive:true}, function(err,result){
                    if(err) {
                        throw err;
                    }
                    if(!result.accessID) { //Check if lecture has accessid
                        return;
                    }
                    socket.join(room); //join the lecture
                    //Get lecture status
                    client.get('q'+room, function(err,question){  //Get current question for lecture
                        client.get('t'+room, function(err,teacher){ //get teacher from redis
                            io.sockets.socket(teacher).emit('studentConnect'); //Send connect notice to lecturer
                            socket.emit('gotoQuestion', question); //Send student to current question
                        });
                    });
                    //Set room name on socket
                    socket.set('room',room,function(err) {
                        if(err) {
                            throw err;
                        }
                        console.log('Student joined lecture ' + room);
                    });
                });
            }
        });

        //Leaving Lecture
        socket.on('disconnect',function() {
            socket.get('room',function(err,room) {
                if(err) {
                    throw err;
                }
                client.get('t'+room, function(err,teacher) {
                    if(!teacher){ //not a proper connection
                        return;
                    }
                    if(socket.id === teacher) { //teacher disconnects
                        client.del('t'+room); //Clear teacher for lecture
                        client.del('q'+room); //Clear currentQuestion for lecture
                    }
                    else { //student disconnects
                        //Checkout user
                        socket.get('user',function(err,user){
                            if(err) {
                                 throw err;
                            }
                            if(user) {
                                client.del('u'+user);
                            }
                        });
                        io.sockets.socket(teacher).emit('studentDisconnect'); //Send disconnect notice to lecturer
                    }
                });
                console.log('User disconnected');
            });
        });
        console.log('New user connected');
    });
}