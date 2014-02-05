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
                .when('/teacher/modules/:id', {
                    templateUrl: 'views/teacher/module.html',
                    controller: 'ModuleCtrl'
                })
                .when('/teacher/lectures/:id', {
                    templateUrl: 'views/teacher/lecture.html',
                    controller: 'LectureCtrl'
                })
                .when('/teacher/homework/:id', {
                    templateUrl: 'views/teacher/homework.html',
                    controller: 'HomeworkCtrl'
                })
                .when('/student', {
                    templateUrl: 'views/student/index.html'
                })
                .when('/student/lecture', {
                    templateUrl: 'views/student/lecture.html'
                })
                .when('/student/homework', {
                    templateUrl: 'views/student/homework.html'
                })
                .when('/student/homework/:id', {
                    templateUrl: 'views/student/dohomework.html',
                    controller: 'DoHomeworkCtrl'
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