'use strict'

angular.module('voteApp')
    .controller('StdaIDLectureCtrl', ['$scope','$routeParams','Lecture','SocketIO',
        function($scope,$routeParams,Lecture,socket){
            //Reconnect socket in case student had left the lecture
            socket.socket.connect();

            //SOCKETIO
            //Goto given question
            socket.on('gotoQuestion',function(data) {
                $scope.question = $scope.lecture.questions[data];
                $scope.currentQuestion = data;
                $scope.resultview = false;
                $scope.waiting = false;
                $scope.$apply();
            });
            //Results for one question
            socket.on('showResults',function(data) {
                if($scope.answers[$scope.currentQuestion].answer === data) {
                    $scope.answers[$scope.currentQuestion].correct = true;
                }
                else {
                    $scope.answers[$scope.currentQuestion].correct = false;
                    $scope.correctAnswer = data;
                }
                $scope.resultview = true;
                $scope.waiting = false;
                $scope.$apply();
            });
            //Lecture Finished
            socket.on('finish',function() {
                //Upload results to server
                if(!$scope.finished) {
                    Lecture.submitAccessID({accessID:$routeParams.accessID}, $scope.answers);
                }
                $scope.finished = true;
                $scope.$apply();
            });
            //Close Connection when leaving page
            $scope.$on('$locationChangeStart', function () {
                socket.disconnect();
            });

            //Get Lecture Data
            $scope.lecture = Lecture.getAccessIDLecture({accessID:$routeParams.accessID},function() {
                //Lecture completed
                if($scope.lecture.submission) {
                    $scope.answers = $scope.lecture.submission.results;
                    $scope.finished = true;
                }
                //Following Live Lecture
                else {
                    $scope.question = $scope.lecture.questions[0];
                    $scope.currentQuestion = 0;
                    $scope.answered = false; //Boolean to check whether question been answered
                    $scope.resultview = false;
                    $scope.answers = []; //Array with final answers
                    //Fill array with 'not answered' and add question to answers array
                    for(var i=0;i<$scope.lecture.questions.length;i++) {
                        $scope.answers[i] = {question:$scope.lecture.questions[i].question};
                    }
                    //Join lecture room
                    socket.emit('join', $scope.lecture._id);
                }
            });
            $scope.setAnswered = function() {
                $scope.answered = true;
            }
            $scope.answerQuestion = function() {
                socket.emit('answer', $scope.answers[$scope.currentQuestion].answer);
                $scope.waiting = true;
            }
        }]);