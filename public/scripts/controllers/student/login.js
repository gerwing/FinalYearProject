'use strict'

angular.module('voteApp')
    .controller('StdLoginCtrl', ['$scope', 'Authentication',
        function($scope,authentication) {
            //Set Default password
            $scope.password = "";
            //Set login function
            $scope.login = function() {
                //Login
                authentication.loginStudent($scope);
            };
            $scope.register = function() {
                //Register
                authentication.registerStudent($scope);
            }
            $scope.reset = function() {
                if($scope.usernameError) {
                    delete $scope.usernameError;
                }
            }
    }]);