'use strict'

angular.module('voteApp')
    .controller('TeacherCtrl', ['$scope', '$http', '$rootScope', '$timeout', 'Module', 'Authentication',
        function($scope,$http,$rootScope,$timeout,Module,Authentication) {
            //Check Whether User is logged in as teacher
            if(!Authentication.verifyTeacher()){
                return;
            }

            //Get Modules
            $scope.modules = Module.query();

            //Scope Methods
            $scope.addModule = function() {
                //Save module
                Module.save({},$scope.module, function(module) {
                    $scope.modules.push(module);
                    delete $scope.module;
                });
            };
            $scope.saveModule = function(index) {
                $scope.modules[index].changed = true;
            }
            $scope.saveModules = function() {
                //Turn off editing
                $scope.editing = false;
                //Save edited modules
                for(var i=0;i<$scope.modules.length;i++) {
                    if($scope.modules[i].changed) {
                        var m = $scope.modules[i];
                        delete m.changed;
                        Module.update({id: m._id},{name:m.name});
                    }
                }
            }
            $scope.removeModule = function(index) {
                //Remove module
                var module = $scope.modules.splice(index,1);
                module[0].$delete();
            }

            //Edit profile
            $scope.updateTeacher = function() {
                $http.put('/api/teacher/' + $rootScope.user._id, $rootScope.user)
                    .success(function() {
                        $scope.updateSuccess = true;
                        $timeout(function(){$scope.updateSuccess=false;},3000);
                    })
            };
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
                            $timeout(function(){$scope.passwordError=false;},3000);
                        }
                    })
            };
    }]);