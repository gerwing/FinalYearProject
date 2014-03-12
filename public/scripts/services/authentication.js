'use strict'

angular.module('voteApp')
    .factory('Authentication', ['$http','$rootScope','$location',
        function($http,$rootScope,$location) {
            //General Login Function
            var login = function(scope,path) {
                //Prepare post data
                var data = {username:scope.username, password:scope.password};
                //Try logging in
                $http.post(path, data)
                    .success(function(data) {
                        $rootScope.user = data; //Add user to rootscope
                        if($rootScope.lastPath) {
                            $location.path($rootScope.lastPath); //move to last page
                            delete $rootScope.lastPath;
                        }
                        else {
                            if(data.isTeacher){
                                $location.path('/teacher'); //move to teacher home page
                            }
                            else {
                                $location.path('/student'); //move to student home page
                            }
                        }
                    })
                    .error(function(data, status) {
                        if(status === 401) {  //Login failed
                            if(data.problem === 'username') { //wrong username
                                scope.usernameError = true;
                                scope.passwordError = false;
                                scope.verificationError = false;
                            }
                            else if(data.problem === 'password') { //wrong password
                                scope.usernameError = false;
                                scope.passwordError = true;
                                scope.verificationError = false;
                            }
                            else if(data.problem === 'verification') { //user not verified
                                scope.verificationError = true;
                                scope.user = data.id;
                                scope.usernameError = false;
                                scope.passwordError = false;
                            }
                            scope.errorMessage = data.message; //set an error message
                        }
                    });
            };
            var register = function(scope,path,data) {
                $http.post(path, data)
                    .success(function(user) {
                        scope.registered = true;
                        scope.registering = false;
                    })
                    .error(function(data, status) {
                        if(status === 409) {  //Username taken
                            scope.usernameConflict = true;
                            scope.errorMessage = data.message; //set an error message
                        }
                        else if(status === 406) {
                            scope.missingFields = true;
                            scope.errorMessage = data; //set an error message
                        }
                    });
            };
            return {
                loginTeacher: function(scope) {
                    login(scope,'/api/teacher/login');
                },
                loginStudent: function(scope) {
                    login(scope,'/api/student/login');
                },
                registerStudent: function(scope) {
                    //Prepare post data
                    var data = {username:scope.username, password:scope.password};
                    register(scope,'/api/student/register',data);
                },
                registerTeacher: function(scope) {
                    //Prepare post data
                    var data = {username:scope.username, password:scope.password,
                                name:scope.name, email:scope.email};
                    register(scope,'/api/teacher/register',data);
                },
                logout: function() {
                    $http.post('/api/user/logout').
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
                setCurrentUser: function(user) {
                    $rootScope.user = user;
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
                },
                verifyStudent: function() {
                    //Check for logged in user
                    if($rootScope.user) {
                        return true;
                    }
                    //User needs to log in
                    //Save current path
                    $rootScope.lastPath = $location.path();
                    //Redirect to login page
                    $location.path('/student/login');
                    return false;
                }
            };
    }]);