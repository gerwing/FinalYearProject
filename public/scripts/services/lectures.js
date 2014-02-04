'use strict'

angular.module('voteApp')
    .factory('Lecture', ['$resource',
        function($resource) {
          return $resource(
              "/api/teacher/lectures/:id",
              {id: "@_id" },
              {
                  "update": {method: "PUT"}
              }
          );
        }
    ]);