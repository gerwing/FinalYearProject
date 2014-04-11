'use strict'

angular.module('voteApp')
    .controller('StdHomeworkCtrl',['$scope','$routeParams','Homework','Authentication',
    function($scope,$routeParams,Homework,Authentication) {
        //Check Whether User is logged in as teacher
        if(!Authentication.verifyStudent()){
            return;
        }

        /**INITIALIZE SCOPE*/
        $scope.homework = Homework.getHomework({id:$routeParams.id},function(){
            //Homework completed
            if($scope.homework.submission) {
                $scope.results = $scope.homework.submission.results;
                $scope.finished = true;
            }
            else { //Homework has yet to be done
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
            }
        });

        /**SCOPE METHODS*/
        //goto next question
        $scope.nextQuestion = function() {
            $scope.currentQuestion += 1;
            $scope.question = $scope.homework.questions[$scope.currentQuestion];
            if($scope.lastAnswered<$scope.currentQuestion) {
                $scope.lastAnswered = $scope.currentQuestion; //Set new last answered question
            }
        };
        //Final submit homework to server
        $scope.submitHomework = function() {
            //Submit Question
            Homework.submit({id:$scope.homework._id}, $scope.answers ,function(submission) {
                $scope.finished = true;
                $scope.results = submission.results;
            });
        };
        //Mark question as answered
        $scope.setAnswered = function() {
            $scope.answered[$scope.currentQuestion] = true;
        };
        //Go to specific Question
        $scope.gotoQuestion = function(index) {
            $scope.currentQuestion = index;
            $scope.question = $scope.homework.questions[$scope.currentQuestion];
        };
    }]);