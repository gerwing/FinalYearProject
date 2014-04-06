'use strict'

angular.module('voteApp')
    .factory('SocketIO', function () {
        var socket = io.connect();
        return socket;
    });