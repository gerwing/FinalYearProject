'use strict';

//Initialize App
var app = angular.module('voteApp', ['ngRoute'])
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
app.run(['$http', '$rootScope', '$location',
    function($http,$rootScope,$location) {
    //Try get user
    $http({method: 'GET', url: '/api/currentUser'}).
        success(function(data) {
            if(data) {
                $rootScope.user = data;
            }
        });

    //Set Logout function
    $rootScope.logout = function() {
        $http.post('/api/teacher/logout').
            success(function() {
                $location.path('/');
                delete $rootScope.user;
            });
    }
}]);