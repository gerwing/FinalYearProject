'use strict'

angular.module('voteApp')
    .controller('TeacherCtrl', ['$scope', 'Module', 'Authentication',
        function($scope, Module, Authentication) {
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

    }]);