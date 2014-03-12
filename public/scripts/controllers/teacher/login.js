'use strict'

angular.module('voteApp')
    .controller('LoginCtrl', ['$scope', '$http', 'Authentication',
        function($scope,$http,authentication) {
            //Set login function
            $scope.login = function() {
                authentication.loginTeacher($scope);
            };
            //Set Register function
            $scope.register = function() {
                authentication.registerTeacher($scope);
            }
            //Resend Verification Email
            $scope.resendVerification = function() {
                $http.post("/api/user/verify/resend", {user:$scope.user});
                $scope.verificationSent = true;
            }
    }]);