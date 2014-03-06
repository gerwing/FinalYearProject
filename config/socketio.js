/*
 *  Socket IO Configuration for Live Lectures
 */
module.exports = function(io) {
    var currentQuestion = {};
    var teacher = {};
    io.sockets.on('connection', function (socket) {
        //Student answers
        socket.on('answer', function (data) {
            socket.get('room',function(err,room) {
                if(err) {
                    throw err;
                }
                io.sockets.socket(teacher[room]).emit('newAnswer', data); //Send answer to lecturer
                console.log('answered ' + data);
            });
        });
        //Lecturer goes to next question
        socket.on('changeQuestion', function(data) {
            socket.get('room', function(err,room) {
                if(err) {
                    throw err;
                }
                currentQuestion[room] = data;
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
        //Join Lecture room
        socket.on('join', function(room) {
            socket.join(room);
            if(!currentQuestion[room] && currentQuestion[room] != 0) {
                currentQuestion[room] = 0;
            }
            //First person to connect is teacher, store his id
            if(!teacher[room]) {
                teacher[room] = socket.id;
            }
            else {
                console.log(teacher[room]);
                //Only when teacher has already been connected ie Student connects
                io.sockets.socket(teacher[room]).emit('studentConnect'); //Send connect notice to lecturer
                socket.emit('gotoQuestion', currentQuestion[room]); //Send student to current question
            }
            //Set room name on socket
            socket.set('room',room,function(err) {
                if(err) {
                    throw err;
                }
                console.log('User joined lecture ' + room);
            });
        });
        socket.on('disconnect',function() {
            socket.get('room',function(err,room) {
                if(err) {
                    throw err;
                }
                if(socket.id === teacher[room]) {
                    teacher[room] = null; //Clear teacher for lecture
                    currentQuestion[room] = null; //Clear currentQuestion for lecture
                }
                else {
                    io.sockets.socket(teacher[room]).emit('studentDisconnect'); //Send disconnect notice to lecturer
                }
                console.log('User disconnected');
            });
        });
        console.log('New user connected');
    })
}