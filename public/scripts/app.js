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
                    templateUrl: 'views/teacher/teacher.html',
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
                .when('/teacher/lectures/live/:id', {
                    templateUrl: 'views/teacher/liveLecture.html',
                    controller: 'LiveLectureCtrl'
                })
                .when('/teacher/homework/:id', {
                    templateUrl: 'views/teacher/homework.html',
                    controller: 'HomeworkCtrl'
                })
                .when('/student/login', {
                    templateUrl: 'views/student/login.html',
                    controller: 'StdLoginCtrl'
                })
                .when('/student', {
                    templateUrl: 'views/student/student.html',
                    controller: 'StudentCtrl'
                })
                .when('/student/lectures/:id', {
                    templateUrl: 'views/student/lecture.html',
                    controller: 'StdLectureCtrl'
                })
                .when('/student/joinLecture/:accessID', {
                    templateUrl: 'views/student/lecture.html',
                    controller: 'StdaIDLectureCtrl'
                })
                .when('/student/homework/:id', {
                    templateUrl: 'views/student/homework.html',
                    controller: 'StdHomeworkCtrl'
                })
                .when('/verify/:token', {
                    templateUrl: 'views/verify.html',
                    controller: 'VerifyCtrl'
                })
                .when('/resetPassword', {
                    templateUrl: 'views/passwordSubmit.html',
                    controller: 'PasswordResetCtrl'
                })
                .when('/resetPassword/:token', {
                    templateUrl: 'views/passwordReset.html',
                    controller: 'PasswordResetCtrl'
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
        $rootScope.logout = authentication.logout;
}]);