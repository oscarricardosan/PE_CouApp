var Alert_proximity= (function () {

    var run= function(){
        alerts_by_proximity();
        Process.store_last_attempt('proximity_alert');
    };
    
    function alerts_by_proximity() {
        try{
            alerts_by_proximity_deliveries();
            alerts_by_proximity_pickups();
        }catch (e){
            alert('Alert_proximity: '+e.message);
        }
    }

    function alerts_by_proximity_deliveries(){
        DeliveriesModel.findRaw(
            "distance_in_mts<= "+Settings.alert.minimum_meters+" and " +
            "(attemp_gps_alert < "+Settings.alert.attempt_gps+" or attemp_gps_alert is NULL) and " +
            "state_id in (100, 50) and " +
            "date= '"+MomentUtility_.current_date()+"'",
            {
                success:function(tx, results){
                    $.each(results._all, function(index, delivery){
                        DeliveriesModel.increment_attemp_gps_alert(delivery);
                        Notification.event_server_delivery_message(
                            delivery.number+' a '+accounting.formatNumber(delivery.distance_in_mts, 2, '.', ',')+' mts',
                            undefined,
                            {action: 'show_delivery', delivery: delivery}
                        );
                    });
                    if(results._all>=1){
                        navigator.vibrate([1000]);
                        navigator.notification.beep(1);
                    }
                }
            }
        );
    }

    function alerts_by_proximity_pickups(){
        PickupModel.findRaw(
            "distance_in_mts<= "+Settings.alert.minimum_meters+" and " +
            "(attemp_gps_alert < "+Settings.alert.attempt_gps+" or attemp_gps_alert is NULL) and " +
            "state_id in (100, 50) and " +
            "date= '"+MomentUtility_.current_date()+"'",
            {
                success:function(tx, results){
                    $.each(results._all, function(index, pickup){
                        PickupModel.increment_attemp_gps_alert(pickup);
                        Notification.event_server_pickup_message(
                            pickup.number+' a '+accounting.formatNumber(pickup.distance_in_mts, 2, '.', ',')+' mts',
                            undefined,
                            {action: 'show_pickup', pickup: pickup}
                        );
                    });
                    if(results._all>=1){
                        navigator.vibrate([1000]);
                        navigator.notification.beep(1);
                    }
                }
            }
        );
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            run           : run,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
