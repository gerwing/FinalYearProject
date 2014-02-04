'use strict'

angular.module('voteApp')
    .factory('Authentication', ['$http','$rootScope','$location',
        function($http,$rootScope,$location) {
            return {
                loginTeacher: function(scope) {
                    //Prepare post data
                    var data = {username:scope.username, password:scope.password};
                    //Try logging in
                    $http.post('/api/teacher/login', data)
                        .success(function(data) {
                            $rootScope.user = data; //Add user to rootscope
                            if($rootScope.lastPath) {
                                $location.path($rootScope.lastPath); //move to last page
                                delete $rootScope.lastPath;
                            }
                            else {
                                $location.path('/teacher'); //move to teacher home page
                            }
                        })
                        .error(function(data, status) {
                            if(status === 401) {  //Login failed
                                if(data.problem === 'username') { //wrong username
                                    scope.usernameError = true;
                                    scope.passwordError = false;
                                }
                                else if(data.problem === 'password') { //wrong password
                                    scope.usernameError = false;
                                    scope.passwordError = true;
                                }
                                scope.errorMessage = data.message; //set an error message
                            }
                        });
                },
                logoutTeacher: function() {
                    $http.post('/api/teacher/logout').
                        success(function() {
                            $location.path('/');
                            delete $rootScope.user;
                        });
                },
                getCurrentUser: function() {
                    $http({method: 'GET', url: '/api/currentUser'}).
                        success(function(data) {
                            if(data) {
                                $rootScope.user = data;
                            }
                        });
                },
                verifyTeacher: function() {
                    //Check for logged in teacher
                    if($rootScope.user) {
                        if($rootScope.user.isTeacher) {
                            return true;
                        }
                    }
                    //User needs to log in
                    //Save current path
                    $rootScope.lastPath = $location.path();
                    //Redirect to login page
                    $location.path('/teacher/login');
                    return false;
                }
            };
    }]);