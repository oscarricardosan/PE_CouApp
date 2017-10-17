var Settings= {
    url_server: 'http://courier-app.pasarex-app.app',
    route_api_pasar: function(route){
        return this.url_server+'/mobile_api/'+route;
    }
};
