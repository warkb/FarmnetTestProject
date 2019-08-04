'use strict'

angular.module('farmNetApp').component('personsPage', {
    templateUrl: '/static/app/persons-page/person-page.template.html',
    controller: ['$http', function PhoneListController($http) {
        var self = this;
        // флаг указывает, должен ли запуститься тур
        var tourMustBeRunned = true;
        self.validation_text_selectors = {
            // селекторы для элементов с текстом валидации
            first_name: '#firstname-valid',
            last_name: '#lastname-valid',
            father_name: '#fathername-valid',
            date_text: '#date-valid',
        };
        self.run_tour = function () {
            // запускает тур на сайте
            setTimeout(function () {
                let intro = introJs();
                intro.setOptions({
                    exitOnEsc: true,
                    exitOnOverlayClick: true,
                    skipLabel: 'Пропустить',
                    nextLabel: 'Далее',
                    prevLabel: 'Назад',
                    doneLabel: 'Завершить',
                    showStepNumbers: false,
                    steps: [
                        {
                            intro: "Добро пожаловать. Этот тур проведет вас по базовому функционалу приложения"
                        },
                        {
                            element: document.querySelectorAll('#persons-cards > *')[1],
                            intro: 'Это карточка с пользователем. На ней расположены данные о пользователе, а также кнопки для его редактирования и удаления',
                            position: 'bottom'
                        },
                        {
                            element: '#filtering',
                            intro: 'Вводя текст в это поле вы можете фильтровать карточки по ФИО',
                            position: 'bottom'
                        },
                        {
                            element: '#sorting',
                            intro: 'С помощью этих кнопок вы можете сортировать карточки по ФИО и времени',
                            position: 'bottom'
                        },
                        {
                            element: '#adduser-button',
                            intro: 'Чтобы создать нового пользователя, нажмите на эту кнопку',
                            position: 'bottom'
                        },
                        {
                            intro: 'Спасибо за внимание. Этот тур запускается только при первом просмотре после рестарта сервера'
                        }
                    ]
                });
                intro.start();
            }, 500);
        };
        self.unixtime_to_date = function (unix_time) {
            // преобразует время в формате date в понятную строку с датой
            let date = new Date(unix_time);
            let day = date.getDate();
            day = day < 10 ? "0" + day : day;
            let month = date.getMonth() + 1;
            month = month < 10 ? "0" + month : month;
            return `${day}.${month}.${date.getFullYear()}`;
        };
        self.clean_user_data = function () {
            /**
             * сбрасывает заполнение для формы
             * создания/редактирования пользователя
             */
            self.id = 0;
            self.first_name = '';
            self.last_name = '';
            self.father_name = '';
            self.date = self.unixtime_to_date(new Date().getTime());
            self.editing = false; // находится ли карточка в режиме редактирования
        };
        self.string2unixtime = function (str) {
            // преобразует строку с Русской датой в unixtime
            let date = new Date(str.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1'));
            return date.getTime();
        };
        self.clean_user_data(); // инициализируем форму пользователя
        self.orderProp = 'last_name'; // поле для сортировки
        self.reload_users = function () {
            // синхронизирует список пользователей с базой данных
            $http.get('allpersons').then(function (response) {
                self.persons = JSON.parse(response.data);
                self.persons.forEach(function (item) {
                    // добавляем поля, по котором будет фильтровать
                    item.fio = `${item.first_name} ${item.last_name} ${item.father_name}`;
                    item.unixtime = self.string2unixtime(item.date);
                });
            });
        };
        self.show_validation_text = function (selector) {
            // отображает сообщение об ошибке
            $(selector).removeClass('faded');
        };
        self.hide_validation_text = function (selector) {
            $(selector).addClass('faded');
        };
        self.hide_all_validation = function () {
            // скрываем всю валидацию
            $('.valid-text').addClass('faded');
        };
        self.accept_user = function ($ctrl) {
            // принимает вывод с формы пользователя
            // и отправляет запрос на сервер на добавление/изменение
            let date = self.date;
            let params = {
                id: self.id,
                first_name: self.first_name,
                last_name: self.last_name,
                father_name: self.father_name,
                date: date
            };
            $http.get('changeperson', {params: params})
                .then(function (response) {
                    self.reload_users();
                });
            self.clean_user_data(); // сбрасывает форму
        };
        self.delete_user = function (id) {
            // отправляет в базу запрос на удаление пользователя
            $http.get('delperson', {params: {id: id}})
                .then(function (response) {
                    self.persons = self.persons.filter(function (person) {
                        return person.id != id;
                    });
                })
        }
        self.open_modal = function () {
            $('#add-person-form').modal({
                showClose: false,
                fadeDuration: 150,
            });
        }
        self.edit_user = function (id) {
            // передает пользователя в форму редактирования
            self.hide_all_validation();
            self.open_modal();
            let user = _.findWhere(self.persons, {id: id})
            self.id = user.id;
            self.first_name = user.first_name;
            self.last_name = user.last_name;
            self.father_name = user.father_name;
            self.date = user.date;
        }
        self.click_remove = function (personId) {
            // обработка клика по кнопке Удалить
            swal({
                title: "Вы точно хотите удалить этого пользователя?",
                buttons: ['Отмена', 'Да'],
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        self.delete_user(personId);
                        // swal("Пользователь был удален", {
                        // });
                    } else {
                    }
                });
        }
        self.close_modal = function () {
            // закрывает модальное окно
            $.modal.close();
            self.clean_user_data();
        };
        self.accept_modal = function (addPersonForm) {
            // обработка подтверждения формы в модалке
            // валидируем
            if (self.first_name === '') {
                self.show_validation_text(
                    self.validation_text_selectors.first_name
                );
            }
            if (self.last_name === '') {
                self.show_validation_text(
                    self.validation_text_selectors.last_name
                );
            }
            if (self.father_name === '') {
                self.show_validation_text(
                    self.validation_text_selectors.father_name
                );
            }
            if (isNaN(self.date)) {
                self.show_validation_text(
                    self.validation_text_selectors.date_text
                );
            }
            if (addPersonForm.$valid) {
                self.accept_user();
                self.close_modal();
            }
        };
        self.click_add_user = function () {
            // обработка нажатия на кнопку Добавить нового пользователя
            self.hide_all_validation();
            self.clean_user_data();
            self.open_modal();
        };
        // вытягиваем пользователей с сервера
        self.reload_users();

        // настраиваем Datetimepicker
        $.datetimepicker.setLocale('ru');
        $.datetimepicker.set
        // Инициализируем
        $('#date-input').datetimepicker(
            {
                timepicker: false,
                format: 'd.m.Y'
            }
        );

        // отображаем
        $('#date-button').click(function (event) {
            $('#date-input').datetimepicker('show');
        });

        // запускаем тур, если нужно
        $http.get('needtour').then(function (response) {
            console.log(response.data.need_tour);
            console.log(response.data);

            if (JSON.parse(response.data).need_tour){
                // запускаем тур
                self.run_tour();
            }
        });

        // действия при закрытии модалки
        $('#add-person-form').on($.modal.CLOSE, function (event, modal) {
            // закрываем календарь
            $('#date-input').datetimepicker('hide');
        })
    }]
});