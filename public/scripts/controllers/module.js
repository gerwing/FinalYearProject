'use strict'

angular.module('voteApp')
    .controller('ModuleCtrl', ['$scope', '$route', 'Module','Lecture','Homework',
        function($scope,$route,Module,Lecture,Homework) {
            //Get Module Data
            $scope.module = Module.get({id: $route.current.params.id});

            //Set Functions for adding Lectures and Homework
            $scope.addLecture = function() {
                //Assemble data
                if($scope.lecture) {
                    var postData = $scope.lecture;
                }
                else {
                    var postData = {};
                }
                postData.module = $scope.module._id;
                //Save lecture
                Lecture.save({},postData, function(lecture) {
                    $scope.module.lectures.push(lecture);
                    delete $scope.lecture;
                });
            };
            $scope.addHomework = function() {
                //Assemble data
                if($scope.homework) {
                    var postData = $scope.homework;
                }
                else {
                    var postData = {};
                }
                postData.module = $scope.module._id;
                //Save lecture
                Homework.save({},postData, function(homework) {
                    $scope.module.homework.push(homework);
                    delete $scope.homework;
                });
            };
    }]);