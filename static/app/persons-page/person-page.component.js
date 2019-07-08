'use strict'

angular.
module('farmNetApp').
component('personsPage', {
	templateUrl: '/static/app/persons-page/person-page.template.html',
	controller: ['$http', function PhoneListController($http) {
		var self = this;
		self.buttonAddChangeText = {
			add: 'Создать',
			change: 'Редактировать'
		}
		self.clean_user_data = function() {
			/** 
			 * сбрасывает заполнение для формы 
			 * создания/редактирования пользователя
			 */
			 self.id = 0;
			 self.first_name = '';
			 self.last_name = '';
			 self.father_name = '';
			 self.unix_time = '';
			 self.editing = false; // находится ли карточка в режиме редактирования
			}
		self.clean_user_data(); // инициализируем форму пользователя
		self.orderProp = 'last_name'; // поле для сортировки
		self.reload_users = function() {
		// синхронизирует список пользователей с базой данных
		$http.get('allpersons').then(function(response) {
			self.persons = JSON.parse(response.data);
		});
	}
	self.accept_user = function ($ctrl) {
			// принимает вывод с формы пользователя
			// и отправляет запрос на сервер на добавление/удаление
			let unix_time = parseInt(self.unix_time);
			if (isNaN(unix_time)) {
				unix_time = 0;
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
				self.reload_users();
			});
			self.clean_user_data(); // сбрасывает форму
		},
		self.delete_user = function (id) {
			// отправляет в базу запрос на удаление пользователя
			$http.get('delperson', {params: {id: id}})
			.then(function (response) {
				self.persons = self.persons.filter(function (person) {
					return person.id != id;
				});
			})
		}
		self.edit_user = function(id) {
			// передает пользователя в форму редактирования
			let user = _.findWhere(self.persons, {id: id})
			self.id = user.id;
			self.first_name = user.first_name;
			self.last_name = user.last_name;
			self.father_name = user.father_name;
			self.unix_time = user.unix_time;
		}
		self.reload_users();
	}]
});