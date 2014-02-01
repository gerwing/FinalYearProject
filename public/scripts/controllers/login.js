'use strict'

angular.module('voteApp')
    .controller('LoginCtrl', ['$scope', '$http', '$rootScope', '$location',
        function($scope,$http,$rootScope,$location) {
            //Set login function
            $scope.login = function() {
                //Prepare post data
                var data = {username:$scope.username, password:$scope.password};
                //Try logging in
                $http.post('/api/teacher/login', data)
                    .success(function(data) {
                        $rootScope.user = data; //Add user to rootscope
                        $location.path('/teacher'); //move to teacher home page
                    })
                    .error(function(data, status) {
                        if(status === 401) {  //Login failed
                            if(data.problem === 'username') { //wrong username
                                $scope.usernameError = true;
                                $scope.passwordError = false;
                            }
                            else if(data.problem === 'password') { //wrong password
                                $scope.usernameError = false;
                                $scope.passwordError = true;
                            }
                            $scope.errorMessage = data.message; //set an error message
                        }
                    });
            };
    }]);