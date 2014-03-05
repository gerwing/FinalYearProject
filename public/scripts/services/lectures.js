'use strict'

angular.module('voteApp')
    .factory('Lecture', ['$resource',
        function($resource) {
          return $resource(
              "/api/teacher/lectures/:id",
              {id: "@_id" },
              {
                  "update": {method: "PUT"},
                  "getAllLectures" : {method:"GET", url:"/api/student/lectures", isArray:true},
                  "getLecture": {method:"GET", url:"/api/student/lectures/:id"}
              }
          );
        }
    ]);