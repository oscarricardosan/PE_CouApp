var Settings= {
    url_pasar_server: 'https://courier-app.pasarex-app.net',
    route_api_pasar: function(route){
        return this.url_pasar_server+'/mobile_api/'+route;
    }
};
