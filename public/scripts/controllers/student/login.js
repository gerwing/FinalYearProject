'use strict'

angular.module('voteApp')
    .controller('StdLoginCtrl', ['$scope', 'Authentication',
        function($scope,authentication) {
            //Set Default password
            $scope.password = "";
            //Set login function
            $scope.login = function() {
                //Hash username

                //Set standard empty password
                if($scope.password === "") {
                    $scope.password = "student";
                }
                //Login
                authentication.login($scope);
            };
    }]);