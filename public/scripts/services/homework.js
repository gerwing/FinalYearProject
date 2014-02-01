'use strict'

angular.module('voteApp')
    .factory('Homework', ['$resource',
        function($resource) {
            return $resource(
                "/api/teacher/homework/:Id",
                {Id: "@Id" },
                {
                    "update": {method: "PUT"}
                }
            );
        }
    ]);