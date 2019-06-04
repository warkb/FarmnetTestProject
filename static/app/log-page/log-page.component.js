'use strict'

angular.
module('farmNetApp').
component('logPage', {
	templateUrl: '/static/app/log-page/log-page.template.html',
	controller: function () {
		let loginCardElement = $('#login-card');
		let top = ($(window).height() - loginCardElement.height()) / 2.5;
		let left = ($(window).width() - loginCardElement.width()) / 2;
		loginCardElement.offset(
			{top:top, left:left}
			);
			// скрипты для подсказок
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
			})  
		}
	});