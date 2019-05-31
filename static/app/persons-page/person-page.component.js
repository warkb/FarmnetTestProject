'use strict'

angular.
module('farmNetApp').
component('personsPage', {
	templateUrl: '/static/app/persons-page/person-page.template.html',
	controller: ['$http', function PhoneListController($http) {
		var self = this;
		self.id = 0;
		self.first_name = '';
		self.last_name = '';
		self.father_name = '';
		self.unix_time = '';
		$http.get('allpersons').then(function(response) {
			self.persons = JSON.parse(response.data);
		});
		self.accept_user = function ($ctrl) {
			let unix_time = parseInt(self.unix_time);
			console.log(`unix-time = ${unix_time}`);
			if (isNaN(unix_time)) {
				unix_time = 0;
				console.log('New ut');
			}
			let params = {
				id: self.id,
				first_name: self.first_name,
				last_name: self.last_name,
				father_name: self.father_name,
				unix_time: unix_time
			}
			$http.get('changeperson', {params: params})
				.then(function(response) {
				self.persons.push(JSON.parse(response.data));
			});
		}
	}]
});