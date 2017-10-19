var bookApp = angular.module('bookApp', ['ngRoute']);

//Set up routes
bookApp.config(function ($routeProvider, $locationProvider) {

    $routeProvider
    //Homepage
    .when('/', {
          templateUrl: 'pages/main.html',
        controller: 'mainController'
    })
    //Search page wth parameters
    .when('/search/:q', {
        templateUrl: 'pages/second.html',
        controller: 'secondController'
    });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);

});


//Controller for the search page
bookApp.controller('mainController', ['$scope', '$log', '$location', function($scope, $log, $location) {

  //Add searchTerm to scope.
  $scope.searchTerm = '';

  //Function that runs when user clicks search button.
  $scope.search = function(){
    $scope.noText = false;
    if($scope.searchTerm === ''){
      $scope.noText = true;
    }else{
      //Change page to search
      $location.path('/search/'+$scope.searchTerm);
    }


  }

}]);

//Contrtoller for search results page
bookApp.controller('secondController', ['$scope', '$log', '$routeParams', '$http', function($scope, $log, $routeParams, $http) {

  //Set q to the route paramters, if none then set to 0
  $scope.q = $routeParams.q;
  
    //Run get request to Google Books Api with the route paramters
    $http.get('https://www.googleapis.com/books/v1/volumes?q='+$scope.q)
        .success(function (result) {
          //Set up books to eaual the result items returned from Google
          $scope.books = result.items;

        })
        .error(function (data, status) {
            //If error log results
            $log.info(status);
        });


  //Function to shorten book descriptions.
  $scope.shortenContent = function(str='No description available') {
    return str.split(' ').slice(0, 100).join(' ');
  }

}]);

//Directive for search results.
bookApp.directive('searchResults', function() {
  return{
    templateUrl: 'directives/searchresult.html',
    scope:  {
      booksObject: "=", //Pass in books object
      shortenContentFunction: "&" //Pass in shortenContent function
    }
  }
});
