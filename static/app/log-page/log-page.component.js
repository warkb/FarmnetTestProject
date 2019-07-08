'use strict'

angular.
module('farmNetApp').
component('logPage', {
	templateUrl: '/static/app/log-page/log-page.template.html',
	controller: ['$location', function LogPageController($location) {
		var self = this;
		self.step = 0;
		self.validated = true;
		self.login = '';
		self.password = '';
		self.button_text = 'Далее';
		self.init_tips = function () {
				// инициализирует подсказки
				$('input').focus(function(){
					$(this).parents('.form-group').addClass('focused');
				});

				$('input').blur(function(){
					var inputValue = $(this).val();
					if ( inputValue == "" ) {
						$(this).removeClass('filled');
						$(this).parents('.form-group').removeClass('focused');  
					} else {
						$(this).addClass('filled');
					}
				});
			};
		self.next_click = function () {
			// срабатывает при клике на кнопку Далее
			if (self.step === 0) {
				// если на вводе логина
				if (self.login.length > 0) {
					self.step += 1;
					$('#inputs').animate({left: '-240px'}, 250);
					self.button_text = 'Войти';
				} else {
					self.validated = false;
				}
			}
			else {
				if (self.password.length > 0)
				{
					$location.path('/persons');
				} else {
					self.validated = false;
				}
			}
		}
		let loginCardElement = $('#login-card');
		let top = ($(window).height() - 2 * loginCardElement.height()) / 2;
		let left = ($(window).width() - 1.5 * loginCardElement.width()) / 2;
		loginCardElement.offset(
			{top:top, left:left}
			);
		self.init_tips();
	}]
});