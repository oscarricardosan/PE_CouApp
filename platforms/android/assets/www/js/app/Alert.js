var Event_server= (function () {

    var deliveries_today;
    var pickups_today;
    var current_position;

    var run= function(){
        PickupModel.loaded()
        DeliveriesModel.loaded(function(){
            deliveries_today= DeliveriesModel.find({delivery_state_id:1});
            PickupModel.loaded(function(){
                pickups_today= PickupModel.find({pickup_state_id: 1});
                alerts_by_proximity();
            });
        });
    };
    
    function alerts_by_proximity() {
        GpsModel.loaded(function(){
            current_position= GpsModel.get();
            alerts_by_proximity_deliveries();
            alerts_by_proximity_pickups();
        });
    }

    function alerts_by_proximity_deliveries(){
        $.each(deliveries_today, function(index, delivery){
            var distance_in_meters= Haversine.distance(
                {latitude: current_position.latitude, longitude: current_position.longitude},
                {latitude: delivery.latitude, longitude: delivery.longitude}
            );
            if(distance_in_meters <= Settings.alert.minimum_meters){
                Notification.alert('Entrega '+delivery.delivery_number+' a '+distance_in_meters+' metros');
                navigator.vibrate([3000, 2000, 3000]);
                navigator.notification.beep(3);
            }
        });
    }

    function alerts_by_proximity_pickups(){
        $.each(pickups_today, function(index, pickup){
            var distance_in_meters= Haversine.distance(
                {latitude: current_position.latitude, longitude: current_position.longitude},
                {latitude: pickup.latitude, longitude: pickup.longitude}
            );
            if(distance_in_meters <= Settings.alert.minimum_meters){
                Notification.alert('Recolección '+pickup.pickup_number+' a '+distance_in_meters+' metros');
                navigator.vibrate([3000, 2000, 3000]);
                navigator.notification.beep(3);
            }
        });
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            run           : run,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
