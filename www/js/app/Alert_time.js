var Alert_time= (function () {

    var conditional_of_time;
    var run= function(){
        conditional_of_time= get_conditional_of_time();
        alerts_by_proximity();
        Process.store_last_attempt('time_alert');
    };
    
    function alerts_by_proximity() {
        alerts_by_proximity_deliveries();
        alerts_by_proximity_pickups();
    }

    function alerts_by_proximity_deliveries(){
        DeliveriesModel.findRaw(
            "start_time in ("+conditional_of_time+") and " +
            "state_id in (100, 50) and " +
            "date= '"+MomentUtility_.current_date()+"'",
            {
                success:function(tx, results){
                    $.each(results._all, function(index, delivery){
                        Notification.event_server_delivery_message(
                            delivery.number+' a las '+delivery.start_time,
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
            "start_time in ("+conditional_of_time+") and " +
            "state_id in (100, 50) and " +
            "date= '"+MomentUtility_.current_date()+"'",
            {
                success:function(tx, results){
                    $.each(results._all, function(index, pickup){
                        Notification.event_server_pickup_message(
                            pickup.number+' a las '+pickup.start_time,
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

    function alerts_by_proximity_pickups(){
        VisitModel.findRaw(
            "start_time in ("+conditional_of_time+") and " +
            "state_id in (100, 50) and " +
            "date= '"+MomentUtility_.current_date()+"'",
            {
                success:function(tx, results){
                    $.each(results._all, function(index, visit){
                        Notification.event_server_visit_message(
                            visit.number+' a las '+visit.start_time,
                            undefined,
                            {action: 'show_visit', visit: visit}
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

    function get_conditional_of_time() {
        var times= [];
        for(var i = 0; i< Settings.timer_run_alert_time; i++){
            var time_search = moment().add(Settings.alert.minimum_minutes, 'minutes' );
            var hour= time_search.hour()<10?'0'+time_search.hour()*1:time_search.hour();
            var minute= time_search.minute()-i;
            var minute_= minute<10?'0'+minute*1:minute;
            times.push(hour+':'+minute_+':00');
        }
        return "'"+times.join("', '")+"'";
    }
    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            run           : run,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
