'use strict'

angular.module('voteApp')
    .controller('StudentCtrl', ['$scope', '$http', 'Authentication', 'Module', 'Homework', 'Lecture',
    function($scope,$http,Authentication,Module,Homework,Lecture){
        //Check Whether User is logged in as teacher
        if(!Authentication.verifyStudent()){
            return;
        }

        var refresh = function() {
            $scope.homework = Homework.getAllHomework();
            $scope.lectures = Lecture.getAllLectures();
            $scope.modules = Module.getSubscribed();
        }
        refresh();

        $scope.subscribeModule = function() {
            $scope.subscribeError = false; //Set Module error to default (hidden)
            $http.post('/api/student/subscribe', {id:$scope.module.id})
                .success(function(data) {
                    Authentication.setCurrentUser(data);
                    refresh();
                })
                .error(function(data,status) {
                    if(status === 404) {  //Module not found
                        $scope.subscribeError = true;
                        $scope.errorMessage = data.message; //set an error message
                    }
                    if(status === 409) {  //Already Subscribed
                        $scope.subscribeError = true;
                        $scope.errorMessage = data.message; //set an error message
                    }
                });
            delete $scope.module.id;
        }

        $scope.unsubscribeModule = function(id) {
            $http.post('/api/student/unsubscribe', {id:id})
                .success(function(data) {
                    Authentication.setCurrentUser(data);
                    refresh();
                })
            delete $scope.editing;
        }

        //TOGGLE FUNCTIONALITY
        $scope.CH = false;
        $scope.LL = false;
        $scope.SM = false;
        $scope.MS = false;
        $scope.AH = false;
        $scope.CL = false;
        $scope.toggleCH = function() {
            $scope.CH = !$scope.CH;
        }
        $scope.toggleAH = function() {
            $scope.AH = !$scope.AH;
        }
        $scope.toggleLL = function() {
            $scope.LL = !$scope.LL;
        }
        $scope.toggleSM = function() {
            $scope.SM = !$scope.SM;
        }
        $scope.toggleMS = function() {
            $scope.MS = !$scope.MS;
        }
        $scope.toggleCL = function() {
            $scope.CL = !$scope.CL;
        }
    }]);