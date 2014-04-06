'use strict'

angular.module('voteApp')
    .factory('SocketIO', function () {
        var socket = io.connect('ws://vote-gaving.rhcloud.com:8000/');
        return socket;
    });