'use strict'

angular.module('voteApp')
    .factory('Module', ['$resource',
        function($resource) {
          return $resource(
              "/api/teacher/modules/:id",
              {id: "@id" },
              {
                  "update": {method: "PUT"}
              }
          );
        }
    ]);