var Notification= (function () {

    var ajax_queue_message= function(title, message){
        cordova.plugins.notification.local.schedule({
            id: Settings.notification_id.queue_ajax,
            title: title,
            text: message,
            icon: Settings.icon.message,
            foreground: true
        });
    };

    var ajax_queue_danger= function(title, message){
        cordova.plugins.notification.local.schedule({
            id: Settings.notification_id.queue_ajax,
            title: title,
            text: message,
            icon: Settings.icon.danger,
            foreground: true
        });

    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            ajax_queue_message       : ajax_queue_message,
            ajax_queue_danger        : ajax_queue_danger,
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();

