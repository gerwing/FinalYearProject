/*
 *  Socket IO Configuration for Live Lectures
 */
module.exports = function(io) {
    io.sockets.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
        console.log("wasup dog");
    })
}