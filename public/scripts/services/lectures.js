'use strict'

angular.module('voteApp')
    .factory('Lecture', ['$resource',
        function($resource) {
          return $resource(
              "/api/teacher/lectures/:Id",
              {Id: "@Id" },
              {
                  "update": {method: "PUT"}
              }
          );
        }
    ]);