'use strict'

angular.module('voteApp')
    .controller('StudentCtrl', ['$scope', '$http', 'Authentication', 'Module', 'Homework',
    function($scope,$http,Authentication,Module,Homework){
        //Check Whether User is logged in as teacher
        if(!Authentication.verifyStudent()){
            return;
        }
        $scope.homework = Homework.getHomework();
        $scope.subscribeModule = function() {
            $scope.moduleNotFound = false; //Set Module error to default (hidden)
            $http.post('/api/student/subscribe', {id:$scope.module.id})
                .success(function(data) {
                    Authentication.setCurrentUser(data);
                })
                .error(function(data,status) {
                    if(status === 404) {  //Username taken
                        $scope.moduleNotFound = true;
                        $scope.errorMessage = data.message; //set an error message
                    }
                });
        }
    }]);