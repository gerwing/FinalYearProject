'use strict'

angular.module('voteApp')
    .controller('LoginCtrl', ['$scope', '$http', '$rootScope', '$location', 'Authentication',
        function($scope,$http,$rootScope,$location,authentication) {
            //Set login function
            $scope.login = function() {
                authentication.loginTeacher($scope);
            };
    }]);