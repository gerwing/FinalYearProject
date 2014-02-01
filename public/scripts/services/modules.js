'use strict'

angular.module('voteApp')
    .factory('Module', ['$resource',
        function($resource) {
          return $resource(
              "/api/teacher/modules/:Id",
              {Id: "@Id" },
              {
                  "update": {method: "PUT"}
              }
          );
        }
    ]);