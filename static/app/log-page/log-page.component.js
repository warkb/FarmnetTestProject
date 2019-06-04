'use strict'

angular.
module('farmNetApp').
component('logPage', {
	templateUrl: '/static/app/log-page/log-page.template.html',
	controller: ['$location', function LogPageController($location) {
			var self = this;
			self.step = 0;
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
					self.step += 1;
					$('#inputs').animate({left: '-270px'}, 300);
				}
				else {
					$location.path('/persons');
				}
			}
			let loginCardElement = $('#login-card');
			let top = ($(window).height() - loginCardElement.height()) / 2.5;
			let left = ($(window).width() - loginCardElement.width()) / 2;
			loginCardElement.offset(
				{top:top, left:left}
				);
			self.init_tips();
		}]
});