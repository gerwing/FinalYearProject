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
                  "generateID" : {method:"POST", url:"/api/teacher/lectures/:id/accessID"},
                  "removeID" : {method:"DELETE", url:"/api/teacher/lectures/:id/accessID"},
                  "generateStudentIDs" : {method:"POST", url:"/api/teacher/lectures/:id/sIDList", isArray:true},
                  "getStudentIDs" : {method:"GET", url:"/api/teacher/lectures/:id/sIDList", isArray:true},
                  "removeStudentIDs" : {method:"DELETE", url:"/api/teacher/lectures/:id/sIDList"},
                  "verifyStudentIDLecture": {method:"GET", url:"/api/student/lectures/aid/:accessID/:sID/verify"},
                  "getStudentIDLecture": {method:"GET", url:"/api/student/lectures/aid/:accessID/:sID"},
                  "submitStudentIDLecture" : {method:"POST", url:"/api/student/lectures/aid/:accessID/:sID"}

              }
          );
        }
    ]);