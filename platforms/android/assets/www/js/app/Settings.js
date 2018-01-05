var Settings= {
    url_server: null,
    setSettings: function(settings){
        if(settings !== null && settings !== undefined) {
            this.url_server = settings.url_server;
        }
    },
    route_api_pasar: function(route){
        return this.url_server+'/mobile_api/'+route;
    },
    timer_to_gps: 1,//minutes
    timer_check_ajax_queue: 1,//minutes
    timer_get_events_from_server: 1,//minutes
    timer_run_alert_proximity: 3,//minutes
    timer_run_alert_time: 5,//minutes
    notification_id: {
        queue_ajax: 10
    },
    icon:{
        message: "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/chat-128.png",
        danger: "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/racingflags-128.png"
    },
    alert: {
        minimum_meters: 1000,
        minimum_minutes: 10,
        attempt_gps: 1
    },
    delivery_state: {
        50: {name: 'Sin coordenadas', "class": 'fuchsia'},
        100: {name: 'Sin entregar', "class": 'yellow'},
        200: {name: 'Realizada', "class": 'green'},
        300: {name: 'Excepción', "class": 'red'},
        400: {name: 'Cancelada', "class": 'gray'}
    },
    pickup_state: {
        50: {name: 'Sin coordenadas', "class": 'fuchsia'},
        100: {name: 'Sin recoger', "class": 'yellow'},
        200: {name: 'Realizada', "class": 'green'},
        300: {name: 'Excepción', "class": 'red'},
        400: {name: 'Cancelada', "class": 'gray'}
    }
};