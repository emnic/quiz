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
            controller  : 'mainController'
        })
        .when('/:filename', {
            templateUrl : function(params) {
                return params.filename + '.html';
            },
            controller  : 'mainController',
            resolve: { resolvedStartGuess: function($http){
                return $http.get('/guessreset')
                    .success(function(response) {
                        return response;
                    })
                }
            },
        })
        .otherwise({ redirectTo: '/' });
});

// Controllers
quizApp.controller('mainController', function($scope, $http, $location) {
    $scope.newPage = function (url){
            $http.post('/checknav', {'secret':url})
            .success(function(response){

                if(response.result === 'ok'){
                    $location.path('/' + url);
                }
                else{
                    $scope.response = response;
                }
            })
            .error(function(){

        });        
    };
    $scope.checkWinner = function (){
        $scope.show = true;
        $http.post('/checkwinner', {'name':$scope.name, 'email':$scope.mail})
            .success(function(response){

                $scope.message = response.result          
            })
            .error(function(){

        });
        $scope.mail = '';
        $scope.name = '';        
    };
});
quizApp.controller('guessController', function($scope, $http, $location) {
    
    $scope.placeholderText = "Guess a number between 1 and 100"

    $scope.guessNumber = function (){
        $http.post('/guess', {'guess':$scope.guess})
            .success(function(response){
                $scope.response = response;
                $scope.guess = null
                $scope.form.$setPristine()

                if(response.cons_corr_counter === 3){
                    $scope.showNav = true;
                    $scope.placeholderText = "Input Secret Key"
                }
                else{
                    $scope.showNav = false;
                    $scope.placeholderText = "Guess a number between 1 and 100"
                }
            })
            .error(function(){

        });
    };
});