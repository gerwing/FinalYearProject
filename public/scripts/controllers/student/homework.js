'use strict'

angular.module('voteApp')
    .controller('StdHomeworkCtrl',['$scope','$routeParams','Homework',
    function($scope,$routeParams,Homework) {
        $scope.homework = Homework.getHomework({id:$routeParams.id},function(){
            $scope.question = $scope.homework.questions[0];
            $scope.currentQuestion = 0; //Index of current question being shown
            $scope.lastAnswered=0; //Question that was last answered
            $scope.answered = []; //Array that will indicate which questions have been answered
            $scope.answers = []; //Array with final answers
            //Fill array with 'not answered' and add question to answers array
            for(var i=0;i<$scope.homework.questions.length;i++) {
                $scope.answered[i] = false;
                $scope.answers[i] = {question:$scope.homework.questions[i].question};
            }
        });

        $scope.nextQuestion = function() {
            $scope.currentQuestion += 1;
            $scope.question = $scope.homework.questions[$scope.currentQuestion];
            if($scope.lastAnswered<$scope.currentQuestion) {
                $scope.lastAnswered = $scope.currentQuestion; //Set new last answered question
            }
        };

        $scope.submitHomework = function() {
            //Submit Question
            Homework.submit({id:$scope.homework._id}, $scope.answers ,function(results) {
                $scope.finished = true;
                $scope.results = results;
            });
        }

        $scope.setAnswered = function() {
            $scope.answered[$scope.currentQuestion] = true;
        }

        $scope.gotoQuestion = function(index) {
            $scope.currentQuestion = index;
            $scope.question = $scope.homework.questions[$scope.currentQuestion];
        }
    }]);