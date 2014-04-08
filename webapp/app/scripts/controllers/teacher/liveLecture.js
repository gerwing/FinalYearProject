'use strict'

angular.module('voteApp')
    .controller('LiveLectureCtrl', ['$scope', '$routeParams','Lecture','Authentication','SocketIO',
        function($scope,$routeParams,Lecture,Authentication,socket) {
            //Check Whether User is logged in as teacher
            if(!Authentication.verifyTeacher()){
                return;
            }

            /**INITIALIZE SOCKET.IO*/
            //Reconnect socket in case teacher had left the lecture
            socket.socket.connect();
            //Join lecture room
            socket.emit('join', $routeParams.id);
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
            socket.on('newAnswer', function(data) {
                $scope.answered += 1;
                addAnswerChart(data); //Add answer to bar chart
                $scope.$apply();
            });
            //Close Connection when leaving page
            $scope.$on('$locationChangeStart', function () {
                //Mark lecture as offline
                $scope.lecture.isLive = false;
                Lecture.update({id:$scope.lecture._id}, {isLive:false},
                    function(){
                        socket.disconnect(); //Disconnect Teacher
                    });
            });
            //Close Connection when closing window
            window.onbeforeunload = function(){
                //Mark lecture as offline
                $scope.lecture.isLive = false;
                Lecture.update({id:$scope.lecture._id}, {isLive:false});
            }

            /**INITIALIZE SCOPE*/
            //Get Lecture Data
            $scope.lecture = Lecture.get({id: $routeParams.id}, function(){
                //Initialize scope variables
                $scope.question = $scope.lecture.questions[0];
                $scope.currentQuestion = 0; //Index of current question being shown
                $scope.lastAnswered=0; //Question that was last answered
                resetChartData(); //initialize pie chart data
            });
            //Bar Chart Data
            $scope.chartData = { //Bar chart Data
                labels : [],
                answers: [],
                datasets : [{
                    fillColor : "rgba(151,187,205,0.5)",
                    strokeColor : "rgba(151,187,205,1)",
                    data:[]
                }]
            };
            //Bar Chart Options
            $scope.chartOptions = {
                scaleShowGridLines: true,
                scaleShowLabels: false
            };

            /**SCOPE METHODS*/
            $scope.nextQuestion = function() {
                $scope.resultview = false; //turn of resultview
                $scope.currentQuestion += 1;
                $scope.answered = 0;
                $scope.question = $scope.lecture.questions[$scope.currentQuestion];
                if($scope.lastAnswered<$scope.currentQuestion) {
                    $scope.lastAnswered = $scope.currentQuestion; //Set new last answered question
                }
                resetChartData(); //Reset chart data using new question
                socket.emit('changeQuestion', $scope.currentQuestion);
            };
            $scope.gotoQuestion = function(index) {
                $scope.currentQuestion = index;
                $scope.question = $scope.lecture.questions[$scope.currentQuestion];
                resetChartData(); //Reset chart data using new question
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
            };

            /**OTHER METHODS*/
            //Method that resets the data used for the pie chart
            function resetChartData() {
                $scope.chartData.labels = [];
                $scope.chartData.answers = []; //Seperate answer array for quickly finding answer in chart
                $scope.chartData.datasets[0].data = [];
                //Add labels and default data to chart data based on current question
                for(var i=0;i<$scope.question.answers.length;i++) {
                    $scope.chartData.labels.push("A."+(i+1));
                    $scope.chartData.answers.push($scope.question.answers[i].answer);
                    $scope.chartData.datasets[0].data.push(0);
                }
            }
            //Method that registers an answer in the barchart
            function addAnswerChart(answer) {
                //Register answer in bar chart
                var index = $scope.chartData.answers.indexOf(answer);
                $scope.chartData.datasets[0].data[index] += 1;
            }
    }]);