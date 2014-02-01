'use strict';

//Initialize App
var app = angular.module('voteApp', ['ngRoute','ngResource'])
    .config(['$routeProvider','$locationProvider',
        function ($routeProvider, $locationProvider) {
        //Set Routes
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            })
            .when('/teacher', {
                templateUrl: 'views/teacher/index.html',
                controller: 'TeacherCtrl'
            })
            .when('/teacher/login', {
                templateUrl: 'views/teacher/login.html',
                controller: 'LoginCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
        //Set HTML5 Mode
        $locationProvider.html5Mode(true);
    }]);

//Get Current User
app.run(['$http', '$rootScope', '$location', 'Authentication',
    function($http,$rootScope,$location,authentication) {
    //Try get user
    authentication.getCurrentUser();

    //Set Logout function
    $rootScope.logout = authentication.logoutTeacher;
}]);