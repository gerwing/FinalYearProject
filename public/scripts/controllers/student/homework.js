'use strict'

angular.module('voteApp')
    .controller('StdHomeworkCtrl',['$scope','$routeParams','Homework',
    function($scope,$routeParams,Homework) {
        $scope.homework = Homework.doHomework({id:$routeParams.id},function(){
            $scope.question = $scope.homework.questions[0];
            $scope.currentQuestion = 0;
        });

        $scope.nextQuestion = function() {
            $scope.currentQuestion += 1;
            if($scope.homework.questions.length>$scope.currentQuestion) {
                $scope.question = $scope.homework.questions[$scope.currentQuestion];
            }
            else {
                $scope.finished = true;
            }
        };
    }]);