'use strict';

angular.module('Champs', [
  'ngRoute'
, 'Driver'
, 'ngAnimate'
])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/index.html'
      })
      .otherwise({redirectTo: '/'});
  }])