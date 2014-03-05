'use strict'

angular.module('voteApp')
    .controller('LiveLectureCtrl', ['$scope', '$routeParams','Lecture','Authentication','SocketIO',
        function($scope,$routeParams,Lecture,Authentication,socket) {
            //Reconnect socket in case teacher had left the lecture
            socket.socket.connect();

            //Check Whether User is logged in as teacher
            if(!Authentication.verifyTeacher()){
                return;
            }
            //SOCKET IO
            $scope.participators = 0;
            $scope.answered = 0;
            //New student joins
            socket.on('studentConnect', function() {
                $scope.participators += 1;
                $scope.$apply();
            });
            //Student leaves
            socket.on('studentDisconnect', function() {
                $scope.participators -= 1;
                $scope.$apply();
            });
            //New answer received
            socket.on('newAnswer', function() {
                $scope.answered += 1;
                $scope.$apply();
            });
            //Close Connection when leaving page
            $scope.$on('$locationChangeStart', function () {
                //Mark lecture as offline
                $scope.lecture.isLive = false;
                Lecture.update({id:$scope.lecture._id}, $scope.lecture,
                    function(){
                        socket.disconnect(); //Disconnect Teacher
                    });
            });

            //Get Lecture Data
            $scope.lecture = Lecture.get({id: $routeParams.id}, function(){
                $scope.question = $scope.lecture.questions[0];
                $scope.currentQuestion = 0; //Index of current question being shown
                $scope.lastAnswered=0; //Question that was last answered
            });
            $scope.nextQuestion = function() {
                $scope.resultview = false; //turn of resultview
                $scope.currentQuestion += 1;
                $scope.answered = 0;
                $scope.question = $scope.lecture.questions[$scope.currentQuestion];
                if($scope.lastAnswered<$scope.currentQuestion) {
                    $scope.lastAnswered = $scope.currentQuestion; //Set new last answered question
                }
                socket.emit('changeQuestion', $scope.currentQuestion);
            };
            $scope.showResults = function() {
                $scope.resultview = true; //turn on resultview
                //Get correct answer
                var correctAnswer;
                for(var i=0;i<$scope.question.answers.length;i++){
                    if($scope.question.answers[i].correct){
                        correctAnswer = $scope.question.answers[i].answer
                        break;
                    }
                }
                socket.emit('results',correctAnswer);
            };
            $scope.endLecture = function() {
                //End Lecture
                $scope.finished = true;
                socket.emit('finished');
            }
            $scope.gotoQuestion = function(index) {
                $scope.currentQuestion = index;
                $scope.question = $scope.lecture.questions[$scope.currentQuestion];
            }
    }]);