'use strict'

angular.module('voteApp')
        .factory('SocketIO',
    function() {
        var socket = io.connect('http://localhost:3000');
        return socket;
    });