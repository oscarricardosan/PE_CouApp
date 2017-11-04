var Alert_proximity= (function () {

    var run= function(){
        DeliveriesModel.loaded(function(){
            PickupModel.loaded(function(){
                alerts_by_proximity();
                Process.store_last_attempt('alert_by_proximity');
            });
        });
    };
    
    function alerts_by_proximity() {
        alerts_by_proximity_deliveries();
        alerts_by_proximity_pickups();
    }

    function alerts_by_proximity_deliveries(){
        var deliveries= DeliveriesModel.find({
            distance_in_mts: {"$lte": Settings.alert.minimum_meters},
            $or: [{attempt_gps_alert: {"$lt": Settings.alert.attempt_gps}}, {attempt_gps_alert: undefined}],
            delivery_state_id:1,
            delivery_date: MomentUtility_.current_date()
        });
        $.each(deliveries, function(index, delivery){
            DeliveriesModel.increment_attemp_gps_alert(delivery);
            Notification.event_server_delivery_message(
                delivery.delivery_number+' a '+accounting.formatNumber(delivery.distance_in_mts, 2, '.', ',')+' mts',
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
            distance_in_mts: {"$lte": Settings.alert.minimum_meters},
            $or: [{attempt_gps_alert: {"$lt": Settings.alert.attempt_gps}}, {attempt_gps_alert: undefined}],
            pickup_state_id:1,
            pickup_date: MomentUtility_.current_date()
        });
        $.each(pickups, function(index, pickup){
            PickupModel.increment_attemp_gps_alert(pickup);
            Notification.event_server_pickup_message(
                pickup.pickup_number+' a '+accounting.formatNumber(pickup.distance_in_mts, 2, '.', ',')+' mts',
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
