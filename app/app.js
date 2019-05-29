// Define the `phonecatApp` module
var mainApp = angular.module('mainApp', []);

// Define the `PhoneListController` controller on the `phonecatApp` module
mainApp.controller('MainController', function MainController($scope) {
  $scope.hello = "Hello!!!";
});