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
            $scope.homework = Homework.get({id: $routeParams.id});

            //Variable set when addign new question
            var addingQuestion = false;

            //Set Methods
            $scope.addQuestion = function() {
                //Set Blank Question
                $scope.question = {
                    otherAnswers:[{}],
                    correctAnswer:{}
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
                $scope.question.otherAnswers.push(a);
            };
            $scope.removeAnswer = function(index) {
                $scope.question.otherAnswers.splice(index,1);
            };
    }]);