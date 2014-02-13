'use strict'

angular.module('voteApp')
    .controller('LoginCtrl', ['$scope', 'Authentication',
        function($scope,authentication) {
            //Set login function
            $scope.login = function() {
                authentication.loginTeacher($scope);
            };
            //Set Register function
            $scope.register = function() {
                authentication.registerTeacher($scope);
            }
    }]);