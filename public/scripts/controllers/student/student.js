'use strict'

angular.module('voteApp')
    .controller('StudentCtrl', ['$scope', '$http', '$timeout', 'Authentication', 'Module', 'Homework', 'Lecture',
    function($scope,$http,$timeout,Authentication,Module,Homework,Lecture){
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

        $scope.subscribeModule = function(moduleID) {
            $scope.subscribeError = false; //Set Module error to default (hidden)
            var id;
            if(moduleID) {
                id = moduleID;
            }
            else {
                id = $scope.module.id;
            }
            $http.post('/api/student/subscribe', {id:id})
                .success(function(data) {
                    Authentication.setCurrentUser(data);
                    delete $scope.searchResults; //Clean up search results
                    delete $scope.module.name; //Clean up searchfield
                    refresh();
                })
                .error(function(data,status) {
                    if(status === 404) {  //Module not found
                        //Set subscribe error
                        $scope.subscribeError = true;
                        $timeout(function(){$scope.subscribeError = false;},3000);
                        //Set error message
                        $scope.errorMessage = data.message;
                        $timeout(function(){$scope.errorMessage = null},3000);
                    }
                    if(status === 409) {  //Already Subscribed
                        //Set subscribe error
                        $scope.subscribeError = true;
                        $timeout(function(){$scope.subscribeError = false;},3000);
                        //Set error message
                        $scope.errorMessage = data.message;
                        $timeout(function(){$scope.errorMessage = null},3000);
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

        $scope.searchModules = function() {
            $scope.searchError = false;
            $scope.searchResults = Module.search({name:$scope.module.name}, function() {
                if($scope.searchResults.length===0){
                    $scope.searchError = true;
                    $timeout(function(){$scope.searchError = false;},3000);
                }
            });
        }

        //TOGGLE FUNCTIONALITY
        $scope.CH = false;
        $scope.LL = false;
        $scope.SM = false;
        $scope.MS = false;
        $scope.AH = false;
        $scope.CL = false;
        $scope.SR = false;
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
        $scope.toggleSR = function() {
            $scope.SR = !$scope.SR;
        }
    }]);