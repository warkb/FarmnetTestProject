'use strict'

angular.
module('farmNetApp').
component('personsPage', {
	templateUrl: '/static/app/persons-page/person-page.template.html',
	controller: ['$http', function PhoneListController($http) {
		var self = this;
		$http.get('allpersons').then(function(response) {
			self.persons = JSON.parse(response.data);
		});
	}]
});