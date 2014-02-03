'use strict'

angular.module('voteApp')
    .controller('TeacherCtrl', ['$scope','$rootScope', 'Module', 'Authentication',
        function($scope, $rootScope, Module, Authentication) {
            //Check Wether User is logged in as teacher
            if(!Authentication.verifyTeacher()){
                return;
            }
            //Get Modules
            $scope.modules = Module.query();
            //Add New Module
            $scope.addModule = function() {
                //Save module
                Module.save({},$scope.module, function(module) {
                    $scope.modules.push(module);
                    delete $scope.module;
                });
            };
    }]);