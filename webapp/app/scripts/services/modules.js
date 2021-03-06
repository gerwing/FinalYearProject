'use strict'

angular.module('voteApp')
    .factory('Module', ['$resource',
        function($resource) {
          return $resource(
              "/api/teacher/modules/:id",
              {id: "@_id" },
              {
                  "update": {method: "PUT"},
                  "getSubscribed": {method:"GET", url:"/api/student/subscribed", isArray:true},
                  "search": {method:"GET", url:"/api/student/modules/search", isArray:true}
              }
          );
        }
    ]);