'use strict';

angular.module('voteApp')
    .controller('VerifyCtrl', ['$scope','$routeParams', '$location', '$timeout', '$http',
        function ($scope,$routeParams,$location,$timeout,$http) {
            var token = $routeParams.token;
            //Try verifying the user
            $http.post("/api/user/verify/" + token, {})
                .success(function(data) {
                    $scope.verified = true;
                    $scope.name = data.name;
                    if(data.isTeacher) {
                        $timeout(function(){$location.path('/teacher/login');},4000);
                    }
                    else {
                        $timeout(function(){$location.path('/student/login');},4000);
                    }
                })
                .error(function(data) {
                    $scope.verified = false;
                    $scope.errorMessage = data.message;
                });
    }]);
