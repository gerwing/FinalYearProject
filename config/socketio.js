/*
 *  Socket IO Configuration for Live Lectures
 */
module.exports = function(io) {
    var currentQuestion = 0;
    var teacher;
    io.sockets.on('connection', function (socket) {
        //First person to connect is teacher, store his id
        if(!teacher) {
            teacher = socket.id;
        }
        else { //Only when teacher has already been connected ie Student connects
            io.sockets.socket(teacher).emit('studentConnect'); //Send connect notice to lecturer
            socket.emit('gotoQuestion', currentQuestion); //Send student to current question
        }
        //Student answers
        socket.on('answer', function (data) {
            io.sockets.socket(teacher).emit('newAnswer', data); //Send answer to lecturer
            console.log('answered ' + data);
        });
        //Lecturer goes to next question
        socket.on('changeQuestion', function(data) {
            currentQuestion = data;
            socket.broadcast.emit('gotoQuestion', data); //Send question number to students
            console.log('Go to question ' + data);
        });
        //Lecture shows results
        socket.on('results', function(data) {
            socket.broadcast.emit('showResults', data); //Send right answer to students
            console.log('Answer is ' + data);
        });
        //Lecture has finished
        socket.on('finished', function() {
            socket.broadcast.emit('finish');
            console.log('Lecture Finished');
        });
        socket.on('disconnect',function() {
            if(socket.id === teacher) {
                teacher = null;
            }
            else {
                io.sockets.socket(teacher).emit('studentDisconnect'); //Send disconnect notice to lecturer
            }
            console.log('User disconnected');
        });
        console.log('New user connected');
    })
}