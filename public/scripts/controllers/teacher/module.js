'use strict'

angular.module('voteApp')
    .controller('ModuleCtrl', ['$scope', '$routeParams', 'Module','Lecture','Homework','Authentication',
        function($scope,$routeParams,Module,Lecture,Homework,Authentication) {
            //Check Whether User is logged in as teacher
            if(!Authentication.verifyTeacher()){
                return;
            }

            //Get Module Data
            $scope.module = Module.get({id: $routeParams.id});

            //Set Scope Methods
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
            $scope.saveLecture = function(index) {
                $scope.module.lectures[index].changed = true;
            };
            $scope.saveLectures = function() {
                //Turn off editing
                $scope.editLectures = false;
                //Save edited lectures
                for(var i=0;i<$scope.module.lectures.length;i++) {
                    if($scope.module.lectures[i].changed) {
                        var l = $scope.module.lectures[i];
                        delete l.changed;
                        Lecture.update({id: l._id},{name:l.name});
                    }
                }
            };
            $scope.removeLecture = function(index) {
                //Remove Lecture
                var lecture = $scope.module.lectures.splice(index,1);
                Lecture.delete({id:lecture[0]._id});
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
            $scope.saveHomework = function(index) {
                $scope.module.homework[index].changed = true;
            };
            $scope.saveHomeworks = function() {
                //Turn off editing
                $scope.editHomework = false;
                //Save edited homework
                for(var i=0;i<$scope.module.homework.length;i++) {
                    if($scope.module.homework[i].changed) {
                        var h = $scope.module.homework[i];
                        delete h.changed;
                        Homework.update({id: h._id},{name:h.name});
                    }
                }
            };
            $scope.removeHomework = function(index) {
                //Remove Homework
                var homework = $scope.module.homework.splice(index,1);
                Homework.delete({id:homework[0]._id});
            };
    }]);