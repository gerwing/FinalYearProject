'use strict'

angular.module('voteApp')
    .factory('Homework', ['$resource',
        function($resource) {
            return $resource(
                "/api/teacher/homework/:id",
                {id: "@id" },
                {
                    "update": {method: "PUT"}
                }
            );
        }
    ]);