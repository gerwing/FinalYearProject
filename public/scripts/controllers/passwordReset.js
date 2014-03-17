'use strict';

angular.module('voteApp')
    .controller('PasswordResetCtrl', ['$scope','$routeParams', '$location', '$timeout', '$http',
        function ($scope,$routeParams,$location,$timeout,$http) {
            $scope.passwordSubmit = function() {
                //Request password reset
                $http.post("/api/user/resetPassword", {email:$scope.email})
                    .success(function() {
                        $scope.submitted = true;
                        $timeout(function(){$location.path('/');},5000);
                    })
                    .error(function(data) {
                        $scope.errorMessage = data.message;
                    });
            };

            $scope.resetPassword = function() {
                var token = $routeParams.token;
                //Request password reset
                $http.post("/api/user/resetPassword/" + token, {password:$scope.newPassword})
                    .success(function() {
                        $scope.reset = true;
                        $timeout(function(){$location.path('/');},5000);
                    })
                    .error(function(data) {
                        $scope.errorMessage = data.message;
                    });
            };
    }]);
