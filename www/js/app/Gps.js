var Gps= (function () {

    var watches_id= [];

    var start_tracking_current= function(){
        clear_watches();
        navigator.geolocation.getCurrentPosition(
            store_position,
            function (error) {ProcessBackground.set_main_message_notification_bar('Error '+error.message); },
            {maximumAge: 5000, timeout: 7000, enableHighAccuracy: true}
        );
    };

    var start_tracking= function(){
        clear_watches();
        alert('start_tracking');
        var watchId = navigator.geolocation.watchPosition(
            function(position) {
                alert('start_tracking 1');
                if(optimal_conditions_for_execution_are()) {
                    update_current_position({latitude: position.coords.latitude, longitude: position.coords.longitude});
                    store_position(position);
                    Process.store_last_attempt('gps_tracking');
                }
            },
            function (error) {
                alert('GPS: Error '+error.message);
                ProcessBackground.set_main_message_notification_bar('GPS: Error '+error.message);
            },
            { maximumAge: 5000, timeout: 7000, enableHighAccuracy: true }
        );
        watches_id.push(watchId);
    };

    function store_position_from_background(location) {
        if(optimal_conditions_for_execution_are()) {
            update_current_position(location);
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

    function update_current_position(position){
        GpsModel.clearTable({success: function(){
            App.current_position= {
                latitude: position.latitude,
                longitude: position.longitude
            };
            GpsModel.insert(App.current_position)
        }});
    }

    function store_position(position) {
        AjaxQueue.add({
            process_name: 'GPS: ',
            type: 'post',
            url: 'courier/store_geo_position',
            dataType: 'text',
            data: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                registered_at: MomentUtility_.now()
            }
        });
    }

    function optimal_conditions_for_execution_are() {
        alert('GPS: optimal_conditions_for_execution_are');
        try{
        return Process.it_can_be_executed('gps_tracking', Settings.timer_to_gps) &&
            (moment().hour() >= Settings.gps.start_hour && moment().hour()  <= Settings.gps.end_hour);
        }catch(e){ alert(e.message); }
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
