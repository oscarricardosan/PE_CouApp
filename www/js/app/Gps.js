var Gps= (function () {

        var watches_id= [];

    var start_tracking= function(){
        clear_watches();
        var watchId = navigator.geolocation.watchPosition(
            function(position) {
                if(Process.it_can_be_executed('gps_tracking', Settings.timer_to_gps)){
                    store_position(position);
                    Process.store_last_attempt('gps_tracking');
                }
            },
            function (error) {ProcessBackground.set_main_message_notification_bar('Error '+error.message); },
            { maximumAge: 5000, timeout: 7000, enableHighAccuracy: true }
        );
        watches_id.push(watchId);
    };

    var start_tracking_current= function(){
        clear_watches();
        navigator.geolocation.getCurrentPosition(
            store_position,
            function (error) {ProcessBackground.set_main_message_notification_bar('Error '+error.message); },
            {maximumAge: 5000, timeout: 7000, enableHighAccuracy: true}
        );
    };

    function store_position_from_background(location) {
        if(Process.it_can_be_executed('gps_tracking', Settings.timer_to_gps)) {
            store_position({
                coords: {
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            });
            Process.store_last_attempt('gps_tracking');
        }
        backgroundGeoLocation.finish();
    }

    function store_position(position) {
        navigator.vibrate(500);
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
            start_tracking                  : start_tracking,
            start_tracking_current          : start_tracking_current,
            clear_watches                   : clear_watches,
            store_position_from_background  : store_position_from_background,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
