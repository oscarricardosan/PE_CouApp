var Settings= {
    url_server: 'https://courier-app.savne.net',
    route_api_pasar: function(route){
        return this.url_server+'/mobile_api/'+route;
    },
    timer_to_gps: 1,//minutes
    timer_check_ajax_queue: 5,//minutes
    notification_id: {
        queue_ajax: 1
    },
    icon:{
        message: "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/chat-128.png",
        danger: "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/racingflags-128.png"
    }
};
