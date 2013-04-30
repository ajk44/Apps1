angular.module('app').config [
  '$routeProvider'
  '$locationProvider'
  ($routeProvider, $locationProvider) ->

    $routeProvider
    .when '/negatives', templateUrl: '/views/negatives.html'
    .otherwise redirectTo: '/negatives'

]