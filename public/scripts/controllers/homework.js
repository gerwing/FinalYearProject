'use strict'

angular.module('voteApp')
    .controller('HomeworkCtrl', ['$scope', '$route','Homework',
        function($scope,$route,Homework) {
            //Get Module Data
            $scope.homework = Homework.get({id: $route.current.params.id});
    }]);