'use strict'

angular.module('voteApp')
    .controller('LiveLectureCtrl', ['$scope', '$routeParams','Lecture','Authentication','SocketIO',
        function($scope,$routeParams,Lecture,Authentication,socket) {
            //Check Whether User is logged in as teacher
            if(!Authentication.verifyTeacher()){
                return;
            }
            //Get Lecture Data
            $scope.lecture = Lecture.get({id: $routeParams.id}, function(){
                $scope.question = $scope.lecture.questions[0];
                $scope.currentQuestion = 0; //Index of current question being shown
                $scope.lastAnswered=0; //Question that was last answered
            });
            $scope.nextQuestion = function() {
                $scope.resultview = false; //turn of resultview
                $scope.currentQuestion += 1;
                $scope.question = $scope.lecture.questions[$scope.currentQuestion];
                if($scope.lastAnswered<$scope.currentQuestion) {
                    $scope.lastAnswered = $scope.currentQuestion; //Set new last answered question
                }
            };
            $scope.showResults = function() {
                $scope.resultview = true; //turn on resultview
            };
            $scope.endLecture = function() {
                //End Lecture
                $scope.finished = true;
            }
            $scope.gotoQuestion = function(index) {
                $scope.currentQuestion = index;
                $scope.question = $scope.lecture.questions[$scope.currentQuestion];
            }

            socket.on('news', function (data) {
                console.log(data);
                socket.emit('my other event', { my: 'data' });
            });
    }]);