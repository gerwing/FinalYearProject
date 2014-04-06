'use strict'

angular.module('voteApp')
    .controller('HomeworkCtrl', ['$scope', '$routeParams','$timeout','$location','Homework','Authentication',
        function($scope,$routeParams,$timeout,$location,Homework,Authentication) {
            //Homework is kept in scope containing questions
            //Question object is held in scope separately, this is the object that is linked to modal
            //Change the Question object into an empty object or a current Question from the Homework object

            //Check Whether User is logged in as teacher
            if(!Authentication.verifyTeacher()){
                return;
            }

            //Get Homework Data
            $scope.homework = Homework.get({id: $routeParams.id}, function() {
                //Initialize Statistics
                //Initialize Pie Chart Data and total understanding
                var totalRight = 0;
                var totalWrong = 0;
                for(var i=0;i<$scope.homework.questions.length;i++) {
                    var q = $scope.homework.questions[i];
                    q.chartData = [
                        {
                            value: q.timesRight,
                            color: "#55dd55"
                        },
                        {
                            value: q.timesWrong,
                            color: "#dd5555"
                        }
                    ];
                    //Calculate question score
                    if(q.timesRight+ q.timesWrong === 0){
                        q.rightScore = 0;
                        q.wrongScore = 0;
                    }
                    else {
                        q.rightScore = Math.round((q.timesRight / (q.timesRight+ q.timesWrong)) * 1000)/10;
                        q.wrongScore = Math.round((q.timesWrong / (q.timesRight+ q.timesWrong)) * 1000)/10;
                    }
                    totalRight += q.timesRight;
                    totalWrong += q.timesWrong;
                }
                //Calculate understanding score
                if(totalRight+totalWrong === 0){
                    $scope.understanding = 0;
                }
                else {
                    $scope.understanding = Math.round((totalRight / (totalRight+totalWrong)) * 1000)/10;
                }
            });

            //Variable set when adding new question
            var addingQuestion = false;

            //Set Methods
            $scope.addQuestion = function() {
                //Set Blank Question
                $scope.question = {
                    answers:[{}]
                };
                //Indicate Adding Question
                addingQuestion = true;
            };
            $scope.editQuestion = function(index) {
                //Set current Question
                $scope.question = $scope.homework.questions[index];
                //Indicate not adding question
                addingQuestion = false;
            };
            $scope.removeQuestion = function(index) {
                //Take out Question
                $scope.homework.questions.splice(index,1);
                //Update Homework
                Homework.update({id:$scope.homework._id},$scope.homework);
            };
            $scope.saveQuestion = function() {
                if(addingQuestion) {
                    $scope.homework.questions.push($scope.question);
                    addingQuestion = false;
                }
                Homework.update({id:$scope.homework._id},$scope.homework,
                    function(){
                        $scope.saveSuccess = true;
                        $timeout(function(){$scope.saveSuccess=false;},3000);
                    });
            };
            $scope.addAnswer = function () {
                var a = {};
                $scope.question.answers.push(a);
            };
            $scope.removeAnswer = function(index) {
                $scope.question.answers.splice(index,1);
            };
            $scope.makeLive = function() {
                $scope.homework.isLive = true;
                Homework.update({id:$scope.homework._id},$scope.homework);
            };
            $scope.stopHomework = function() {
                $scope.homework.isLive = false;
                Homework.update({id:$scope.homework._id},$scope.homework);
            };
    }]);