'use strict'

angular.module('voteApp')
    .controller('TeacherCtrl', function($scope, $rootScope, $location) {
        //Check for logged in teacher
        if(!$rootScope.user) {
            $location.path('/teacher/login');
        }
        if(!$rootScope.user.isTeacher) {
            $location.path('/teacher/login');
        }
    });