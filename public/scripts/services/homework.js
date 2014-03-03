'use strict'

angular.module('voteApp')
    .factory('Homework', ['$resource',
        function($resource) {
            return $resource(
                "/api/teacher/homework/:id",
                {id: "@_id" },
                {
                    "update": {method: "PUT"},
                    "getHomework": {method:"GET", url:"/api/student/homework/:id"},
                    "getAllHomework" : {method:"GET", url:"/api/student/homework",isArray:false},
                    "submit" : {method:"POST", url:"/api/student/homework/:id",isArray:true}
                }
            );
        }
    ]);