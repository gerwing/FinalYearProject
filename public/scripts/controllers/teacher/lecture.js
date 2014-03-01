'use strict'

angular.module('voteApp')
    .controller('LectureCtrl', ['$scope', '$routeParams','$timeout','$location','Lecture','Authentication',
        function($scope,$routeParams,$timeout,$location,Lecture,Authentication) {
            //Lecture is kept in scope containing questions
            //Question object is held in scope separately, this is the object that is linked to modal
            //Change the Question object into an empty object or a current Question from the Lectures object

            //Check Whether User is logged in as teacher
            if(!Authentication.verifyTeacher()){
                return;
            }

            //Get Lecture Data
            $scope.lecture = Lecture.get({id: $routeParams.id});

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
                $scope.question = $scope.lecture.questions[index];
                //Indicate not adding question
                addingQuestion = false;
            };
            $scope.removeQuestion = function(index) {
                //Take out Question
                $scope.lecture.questions.splice(index,1);
                //Update Lecture
                Lecture.update({id:$scope.lecture._id},$scope.lecture);
            };
            $scope.saveQuestion = function() {
                if(addingQuestion) {
                    $scope.lecture.questions.push($scope.question);
                    addingQuestion = false;
                }
                Lecture.update({id:$scope.lecture._id},$scope.lecture,
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
                $scope.lecture.isLive = true;
                Lecture.update({id:$scope.lecture._id},$scope.lecture,
                    function(){
                        $scope.saveSuccess = true;
                        $timeout(function(){$scope.saveSuccess=false;},3000);
                    });
            };

            $scope.stopLecture = function() {
                $scope.lecture.isLive = false;
                Lecture.update({id:$scope.lecture._id},$scope.lecture,
                    function(){
                        $scope.saveSuccess = true;
                        $timeout(function(){$scope.saveSuccess=false;},3000);
                    });
            };
    }]);