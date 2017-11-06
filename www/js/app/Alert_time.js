var Alert_time= (function () {

    var time_to_search;
    var run= function(){
        DeliveriesModel.loaded(function(){
            PickupModel.loaded(function(){
                time_to_search= get_time_to_search();
                alerts_by_proximity();
                Process.store_last_attempt('alert_by_time');
            });
        });
    };
    
    function alerts_by_proximity() {
        alerts_by_proximity_deliveries();
        alerts_by_proximity_pickups();
    }

    function alerts_by_proximity_deliveries(){
        var deliveries= DeliveriesModel.find({
            delivery_start_time: time_to_search,
            delivery_state_id:100,
            delivery_date: MomentUtility_.current_date()
        });
        $.each(deliveries, function(index, delivery){
            Notification.event_server_delivery_message(
                delivery.delivery_number+' a las '+delivery.delivery_start_time,
                undefined,
                {action: 'show_delivery', delivery: delivery}
            );
        });
        if(deliveries.length>=1){
            navigator.vibrate([3000, 2000, 3000]);
            navigator.notification.beep(3);
        }
    }

    function alerts_by_proximity_pickups(){
        var pickups= PickupModel.find({
            pickup_start_time: time_to_search,
            pickup_state_id:100,
            pickup_date: MomentUtility_.current_date()
        });
        $.each(pickups, function(index, pickup){
            Notification.event_server_pickup_message(
                pickup.pickup_number+' a las '+pickup.pickup_start_time,
                undefined,
                {action: 'show_pickup', pickup: pickup}
            );
        });
        if(pickups.length>=1){
            navigator.vibrate([3000, 2000, 3000]);
            navigator.notification.beep(3);
        }
    }

    function get_time_to_search() {
        var time_search = moment().add(Settings.alert.minimum_minutes, 'minutes' );
        var hour= time_search.hour()<10?'0'+time_search.hour()*1:time_search.hour();
        var minute= time_search.minute()<10?'0'+time_search.minute()*1:time_search.minute();
        return hour+':'+minute+':00';
    }
    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            run           : run,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
