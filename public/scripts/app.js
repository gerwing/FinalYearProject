'use strict';

angular.module('voteApp', ['ngRoute'])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/teacher', {
          templateUrl: 'views/teacher/index.html',
          controller: 'TeacherCtrl'
      })
        .when('/teacher/login'  , {
            templateUrl: 'views/teacher/login.html',
            controller: 'TeacherCtrl'
        })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(false);
  });
