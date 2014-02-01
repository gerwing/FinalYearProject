'use strict'

angular.module('voteApp')
    .controller('TeacherCtrl', ['$scope','$rootScope','$location', 'Module',
        function($scope, $rootScope, $location, Module) {
            //Check for logged in teacher
            if(!$rootScope.user) {
                $location.path('/teacher/login');
            }
            else if(!$rootScope.user.isTeacher) {
                $location.path('/teacher/login');
            }
            else {
                $scope.modules = Module.query();
            }
    }]);