'use strict';

angular.
  module('farmNetApp').
  config(['$routeProvider',
    function config($routeProvider) {
      $routeProvider.
        when('/logon', {
          template: '<log-page></log-page>'
        }).
        when('/persons', {
          template: '<persons-page></persons-page>'
        })
    }
  ]);
