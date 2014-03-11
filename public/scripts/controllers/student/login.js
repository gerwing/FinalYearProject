'use strict'

angular.module('voteApp')
    .controller('StdLoginCtrl', ['$scope', '$location', 'Authentication', 'Lecture',
        function($scope,$location,authentication,Lecture) {
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
            $scope.joinLecture = function() {
                $scope.lectureError = false;
                $scope.aidLecture = Lecture.getAccessIDLecture({accessID:$scope.accessID}, function() {
                    $location.path('/student/joinLecture/' + $scope.accessID);
                }, function(result) {
                    $scope.lectureError = true;
                    $scope.errorMessage = result.data.message;
                });
            }
    }]);