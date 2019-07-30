/*
 * В этом файле находятся скрипты
 * ответственные за создание рабочего стола
 */

desktopApp = {
    init: function() {
        this.createLayout();
        this.createToolbar()
    },
    createLayout: function() {
        // создать рабочий стол с иконками
        webix.ui({
            id: "screens",
            animate: false,
            cells:[
                {
                    view:"layout",
                    id: "main",
                    css:"desktop-layout",
                    type: "clean",
                    cols:[
                        {
                            view: "list",
                            id: "desktop",
                            width: 105,
                            css:"desktop-items",

                            type: {
                                height: 110,
                                template: "<div class='desktop-item-inner'><img src='#image#'><div class='desktop-icons'> #title#</div></div>",
                                css:"desktop-item"
                            },
                            select: "multiselect",
                            drag: true,
                            // используем список со значками для инициализации всех значков
                            data: webix.copy(desktop_icons),
                            on: {
                                // действие по клику на ярлыке
                                onItemDblClick: desktopApp.wins.showApp //desktopApp.wins.showApp
                            }
                        },
                        {}
                    ]
                }
            ]
        });
    },
    createToolbar: function(){
        // создать панель задач
        webix.ui({
            view:"toolbar",
            id:"toolbar",
            paddingY:2, height:40,
            css:"toolbar-bottom",
            cols: [
                {
                    view: "button",
                    id: "start_button",
                    css:"webix_transparent",
                    type: "image",
                    image: "/static/img/start.png",
                    width: 72,
                },
                {},
                { view:"template", id:"time", width:95, css:"time-template" }
            ]
        });
    },
};