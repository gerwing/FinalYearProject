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
                  "getAccessIDLecture": {method:"GET", url:"/api/student/lectures/aid/:accessID"},
                  "submit" : {method:"POST", url:"/api/student/lectures/:id"},
                  "submitAccessID" : {method:"POST", url:"/api/student/lectures/aid/:accessID"},
                  "generateID" : {method:"PUT", url:"/api/teacher/lectures/:id/accessID"},
                  "removeID" : {method:"DELETE", url:"/api/teacher/lectures/:id/accessID"}
              }
          );
        }
    ]);