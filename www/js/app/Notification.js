var Notification= (function () {

    var ajax_queue_message= function(message, title, data){
        title= title===undefined?'CourierApp Peticiones':title;
        cordova.plugins.notification.local.schedule({
            id: Settings.notification_id.queue_ajax,
            title: title,
            text: message,
            icon: Settings.icon.message,
            foreground: true,
            sound: false,
            data: data
        });
    };

    var ajax_queue_danger= function(message, title, data){
        title= title===undefined?'CourierApp Peticiones':title;
        cordova.plugins.notification.local.schedule({
            id: Settings.notification_id.queue_ajax,
            title: title,
            text: message,
            icon: Settings.icon.danger,
            foreground: true,
            sound: false,
            data: data
        });

    };

    var event_server_pickup_message= function(message, title, data){
        title= title===undefined?'CourierApp Recolección':title;
        cordova.plugins.notification.local.schedule({
            id: generate_random_id(),
            title: title,
            text: message,
            icon: Settings.icon.message,
            foreground: true,
            sound: false,
            data: data
        });
    };

    var event_server_pickup_danger= function(message, title, data){
        title= title===undefined?'CourierApp Recolección':title;
        cordova.plugins.notification.local.schedule({
            id: generate_random_id(),
            title: title,
            text: message,
            icon: Settings.icon.danger,
            foreground: true,
            sound: false,
            data: data
        });
    };

    var event_server_delivery_message= function(message, title, data){
        title= title===undefined?'CourierApp Entrega':title;
        cordova.plugins.notification.local.schedule({
            id: generate_random_id(),
            title: title,
            text: message,
            icon: Settings.icon.message,
            foreground: true,
            sound: false,
            data: data
        });
    };

    var event_server_delivery_danger= function(message, title, data){
        title= title===undefined?'CourierApp Entrega':title;
        cordova.plugins.notification.local.schedule({
            id: generate_random_id(),
            title: title,
            text: message,
            icon: Settings.icon.danger,
            foreground: true,
            sound: false,
            data: data
        });
    };

    var event_server_visit_message= function(message, title, data){
        title= title===undefined?'CourierApp Visita':title;
        cordova.plugins.notification.local.schedule({
            id: generate_random_id(),
            title: title,
            text: message,
            icon: Settings.icon.message,
            foreground: true,
            sound: false,
            data: data
        });
    };

    var event_server_visit_danger= function(message, title, data){
        title= title===undefined?'CourierApp Visita':title;
        cordova.plugins.notification.local.schedule({
            id: generate_random_id(),
            title: title,
            text: message,
            icon: Settings.icon.danger,
            foreground: true,
            sound: false,
            data: data
        });
    };

    var alert= function(message, title, data){
        title= title===undefined?'CourierApp Alerta':title;
        cordova.plugins.notification.local.schedule({
            id: generate_random_id(),
            title: title,
            text: message,
            icon: Settings.icon.message,
            foreground: true,
            sound: false,
            data: data
        });
    };

    function generate_random_id(){
        return Math.floor((Math.random() * 99) + 1)+moment().unix()+Math.floor((Math.random() * 99999) + 1);
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            ajax_queue_message                : ajax_queue_message,
            ajax_queue_danger                 : ajax_queue_danger,
            event_server_pickup_message       : event_server_pickup_message,
            event_server_pickup_danger        : event_server_pickup_danger,
            event_server_delivery_message     : event_server_delivery_message,
            event_server_delivery_danger      : event_server_delivery_danger,
            event_server_visit_message        : event_server_visit_message,
            event_server_visit_danger         : event_server_visit_danger,
            alert                             : alert
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();

