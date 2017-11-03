var Alert_time= (function () {

    var run= function(){
        DeliveriesModel.loaded(function(){
            PickupModel.loaded(function(){
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
        var hour= ;
        var deliveries= DeliveriesModel.find({
            delivery_start_time: {"$lt": Settings.alert.minimum_meters},
            delivery_state_id:1,
            delivery_date: MomentUtility_.current_date()
        });
        $.each(deliveries, function(index, delivery){
            Notification.event_server_delivery_message(
                delivery.delivery_number+' a '+delivery.distance_in_mts+' mts',
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
            delivery_start_time: {"$lt": Settings.alert.minimum_meters},
            pickup_state_id:1,
            pickup_date: MomentUtility_.current_date()
        });
        $.each(pickups, function(index, pickup){
            Notification.event_server_pickup_message(
                pickup.pickup_number+' a '+pickup.distance_in_mts+' mts',
                undefined,
                {action: 'show_pickup', pickup: pickup}
            );
        });
        if(pickups.length>=1){
            navigator.vibrate([3000, 2000, 3000]);
            navigator.notification.beep(3);
        }
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            run           : run,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
