'use strict'

angular.module('voteApp')
    .factory('Homework', ['$resource',
        function($resource) {
            return $resource(
                "/api/teacher/homework/:id",
                {id: "@_id" },
                {
                    "update": {method: "PUT"}
                }
            );
        }
    ]);