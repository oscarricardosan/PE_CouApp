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
        var watchId = navigator.geolocation.watchPosition(
            function(position) {
                App.current_position= {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                optimal_conditions_for_execution_are({
                   yes: function(){
                       update_current_position({latitude: position.coords.latitude, longitude: position.coords.longitude});
                       store_position(position);
                       Process.store_last_attempt('gps_tracking');
                   }
                });
            },
            function (error) {
                ProcessBackground.set_main_message_notification_bar('GPS: Error '+error.message);
            },
            { maximumAge: 5000, timeout: 7000, enableHighAccuracy: true }
        );
        watches_id.push(watchId);
    };

    function store_position_from_background(location) {
        App.current_position= {
            latitude: location.latitude,
            longitude: location.longitude
        };
        optimal_conditions_for_execution_are({
            yes: function(){
                update_current_position(location);
                store_position({
                    coords: {
                        latitude: location.latitude,
                        longitude: location.longitude
                    }
                });
                Process.store_last_attempt('gps_tracking');
            }
        });
        backgroundGeoLocation.finish();
    }

    function update_current_position(position){
        GpsModel.clearTable({success: function(){
            GpsModel.insert(App.current_position);
            DeliveriesModel.update_distances_in_mtrs(App.current_position, {success: function(){
                DeliveriesModel.get({success: function(tx, results){
                    App.operations.deliveries= results._all;
                }});
            }});
            PickupModel.update_distances_in_mtrs(App.current_position, {success: function(){
                PickupModel.get({success: function(tx, results){
                    App.operations.pickups= results._all;
                }});
            }});
            VisitModel.update_distances_in_mtrs(App.current_position, {success: function(){
                VisitModel.get({success: function(tx, results){
                    App.operations.visits= results._all;
                }});
            }});
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

    function optimal_conditions_for_execution_are(callback) {
        try{
            Process.it_can_be_executed('gps_tracking', Settings.timer_to_gps, callback);
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
