'use strict'

angular.module('voteApp')
    .controller('StudentCtrl', ['$scope', '$http', '$timeout','$rootScope','$window','Authentication', 'Module', 'Homework', 'Lecture',
    function($scope,$http,$timeout,$rootScope,$window,Authentication,Module,Homework,Lecture){
        //Check Whether User is logged in as teacher
        if(!Authentication.verifyStudent()){
            return;
        }

        /**INITIALIZE SCOPE*/
        refresh();

        /**SCOPE METHODS*/
        //Subscribe to a module
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
                    if(status === 404 || status === 409 || status === 401) {  //Module not found or conflict or not allowed
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
        //Unscubscribe a module
        $scope.unsubscribeModule = function(id) {
            $http.post('/api/student/unsubscribe', {id:id})
                .success(function(data) {
                    Authentication.setCurrentUser(data);
                    refresh();
                })
            //delete $scope.editing;
        }
        //Search for modules by name
        $scope.searchModules = function() {
            $scope.searchError = false;
            $scope.searchResults = Module.search({name:$scope.module.name}, function() {
                if($scope.searchResults.length===0){
                    $scope.searchError = true;
                    $timeout(function(){$scope.searchError = false;},3000);
                }
            });
        }
        //EDIT PROFILE
        $scope.updatePassword = function() {
            $http.put('/api/user/changePassword/' + $rootScope.user._id, {oldPassword:$scope.oldPassword,newPassword:$scope.newPassword})
                .success(function() {
                    $scope.passwordSuccess = true;
                    $timeout(function(){$scope.passwordSuccess=false;},3000);
                })
                .error(function(data,status) {
                    if(status === 401) {
                        $scope.errorMessage = data.message;
                        $scope.passwordError = true;
                        $timeout(function(){
                            $scope.passwordError=false;
                            delete $scope.errorMessage;
                        },3000);
                    }
                })
        };
        $scope.deleteProfile = function() {
            $http.delete('/api/student/'  + $rootScope.user._id, {})
                .success(function() {
                    delete $rootScope.user;
                    $window.location.reload();
                })
        }

        /**OTHER METHODS*/
        function refresh() {
            $scope.homework = Homework.getAllHomework();
            $scope.lectures = Lecture.getAllLectures();
            $scope.modules = Module.getSubscribed();
        }

        /**TOGGLE PANELS*/
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