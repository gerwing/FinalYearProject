'use strict'

angular.module('voteApp')
    .controller('StudentCtrl', ['$scope', '$http', 'Authentication', 'Module', 'Homework', 'Lecture',
    function($scope,$http,Authentication,Module,Homework,Lecture){
        //Check Whether User is logged in as teacher
        if(!Authentication.verifyStudent()){
            return;
        }

        $scope.homework = Homework.getAllHomework();
        $scope.lectures = Lecture.getAllLectures();

        $scope.subscribeModule = function() {
            $scope.subscribeError = false; //Set Module error to default (hidden)
            $http.post('/api/student/subscribe', {id:$scope.module.id})
                .success(function(data) {
                    Authentication.setCurrentUser(data);
                })
                .error(function(data,status) {
                    if(status === 404) {  //Module not found
                        $scope.subscribeError = true;
                        $scope.errorMessage = data.message; //set an error message
                    }
                    if(status === 409) {  //Already Subscribed
                        $scope.subscribeError = true;
                        $scope.errorMessage = data.message; //set an error message
                    }
                });
        }
    }]);