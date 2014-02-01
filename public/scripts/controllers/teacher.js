'use strict'

angular.module('voteApp')
    .controller('TeacherCtrl', ['$scope','$rootScope','$location', function($scope, $rootScope, $location) {
        //Check for logged in teacher
        if(!$rootScope.user) {
            $location.path('/teacher/login');
        }
        else if(!$rootScope.user.isTeacher) {
            $location.path('/teacher/login');
        }
    }]);