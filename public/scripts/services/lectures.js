'use strict'

angular.module('voteApp')
    .factory('Lecture', ['$resource',
        function($resource) {
          return $resource(
              "/api/teacher/lectures/:id",
              {id: "@_id" },
              {
                  "update": {method: "PUT"},
                  "getAllLectures" : {method:"GET", url:"/api/student/lectures"},
                  "getLecture": {method:"GET", url:"/api/student/lectures/:id"},
                  "submit" : {method:"POST", url:"/api/student/lectures/:id"}
              }
          );
        }
    ]);