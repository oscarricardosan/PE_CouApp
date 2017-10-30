var Gps= (function () {

        var watches_id= [];

    var start_tracking= function(){
        clear_watches();
        var watchId = navigator.geolocation.watchPosition(
            store_position,
            function(){},
            { maximumAge: 5000, timeout: 7000, enableHighAccuracy: true }
        );
        watches_id.push(watchId);
    };

    var store_current_position= function(){
        clear_watches();
        navigator.geolocation.getCurrentPosition(
            function(position) {
                if(Process.it_can_be_executed('gps_tracking', 2))
                    store_position(position);
                Process.store_last_attempt('gps_tracking');
            },
            function () {},
            {maximumAge: 5000, timeout: 7000, enableHighAccuracy: true}
        );
    };

    function store_position(position) {
        ProcessBackground.set_main_message_notification_bar('Tracking GPS' +'latitude: '+position.coords.latitude+' longitude: '+position.coords.longitude);
        ToastrUtility_.warning(
            'latitude: '+position.coords.latitude+' longitude: '+position.coords.longitude
        );
        AjaxQueue.add({
            type: 'post',
            url: 'courier/store_geo_position',
            dataType: 'text',
            data: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                registered_at: MomentUtility_.now()
            },
            successful_online: function(response){
                LogModel.store({
                    message: 'GPS: Transmisión de petición online a servidor exitosa.',
                    status: 'success',
                    data: properties
                });
            },
            failed_online: function(jqXHR, textStatus){
                LogModel.store({
                    message: 'GPS: Error al transmitir al servidor petición online.',
                    status: 'danger',
                    data: properties
                });
            },
            successful_offline: function(response){
                LogModel.store({
                    message: 'GPS: Transmisión de petición offline a servidor exitosa.',
                    status: 'success',
                    data: properties
                });
            },
            failed_offline: function(jqXHR, textStatus){
                LogModel.store({
                    message: 'GPS: Error al transmitir al servidor petición offline.',
                    status: 'danger',
                    data: properties
                });
            }
        });
    }

    var clear_watches= function(){
        $.each(watches_id, function(index, id){
            navigator.geolocation.clearWatch(id);
        });
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            start_tracking                : start_tracking,
            store_current_position        : store_current_position,
            clear_watches                 : clear_watches,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
