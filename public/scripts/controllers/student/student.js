'use strict'

angular.module('voteApp')
    .controller('StudentCtrl', ['$scope', 'Authentication',
    function($scope,Authentication){
        //Check Whether User is logged in as teacher
        if(!Authentication.verifyStudent()){
            return;
        }
    }]);