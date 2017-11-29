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
    timer_to_gps: 3,//minutes
    timer_check_ajax_queue: 5,//minutes
    timer_get_events_from_server: 6,//minutes
    timer_run_alert_proximity: 1,//minutes
    timer_run_alert_time: 1,//minutes
    notification_id: {
        queue_ajax: 10
    },
    icon:{
        message: "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/chat-128.png",
        danger: "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/racingflags-128.png"
    },
    gps:{
        start_hour: 5,
        end_hour: 23
    },
    alert: {
        minimum_meters: 1000,
        minimum_minutes: 10,
        attempt_gps: 1
    }
};

SettingsModel.loaded(function () {
    Settings.setSettings(SettingsModel.get());
});