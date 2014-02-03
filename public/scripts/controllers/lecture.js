'use strict'

angular.module('voteApp')
    .controller('LectureCtrl', ['$scope', '$route','Lecture',
        function($scope,$route,Lecture) {
            //Get Module Data
            $scope.lecture = Lecture.get({id: $route.current.params.id});
    }]);