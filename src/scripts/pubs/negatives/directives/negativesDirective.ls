angular.module('app').directive 'negativesDirective', [
  '$timeout'
  ($timeout) ->
    restrict: 'EA'
    link: (scope, element, attrs) ->
      console.log 'negativesDirective'
]
