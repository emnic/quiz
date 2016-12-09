var quizApp = angular.module('quizApp', ['ngRoute']);

// Routes
quizApp.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'startpage.html',
            controller  : 'mainController'
        })
        // route for the about page
        .when('/about', {
            templateUrl : 'about.html',
            controller  : 'aboutController'
        })
        .otherwise({ redirectTo: '/' });
});

// Controllers
quizApp.controller('mainController', function($scope, $http, $location) {
    $scope.newPage = function (url){
        $location.path('/' + url);
    };

    $scope.guessNumber = function (){
        $http.post('/guess', {
            guess: guess
            })
            .success(function(user){

            })
            .error(function(){

        });
    };    
});