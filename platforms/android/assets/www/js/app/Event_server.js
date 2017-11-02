var Event_server= (function () {
    
    function get_events_from_server() {
        var request = $.ajax({
            url: Settings.route_api_pasar("courier_event/get_all"),
            type: 'post',
            dataType: "json",
            data: SecurityUtility_.add_user_authenticated({})
        });
        request.done(function(server_events){
            process_server_events(server_events);
        });
        request.fail(function(jqXHR, textStatus) {
            AjaxUtility_.processFaillRequest(jqXHR, textStatus);
        });
    }
    
    function process_server_events(server_events) {
        $.each(server_events, function(index, event){
            if(event.collection === "pickups")process_pickups(event);
            if(event.collection === "deliveries")process_deliveries(event);
        });
        if(server_events.length>1){
            navigator.vibrate([3000, 1000, 2000]);
            navigator.notification.beep(3);
        }
    }
    
    function process_pickups(event) {
        PickupModel.insertOrUpdateById(event.data, {
            success: function(model){
                delete_event_in_server(model);
            },
            fail: function(model){
                Notification.event_server_pickup_danger ('Error procesando evento de recolección '+model.pickup_number);
            }
        });
        if(event.event === 'creation')
            Notification.event_server_pickup_message('Recolección creada número'+event.data.pickup_number);
        if(event.event === 'actualization')
            Notification.event_server_pickup_message('Recolección '+event.data.pickup_number+' actualizada');
    }

    function process_deliveries(event){
        DeliveriesModel.insertOrUpdateById(event.data, {
            success: function(model){
                delete_event_in_server(model);
            },
            fail: function(model){
                Notification.event_server_pickup_danger ('Error procesando evento de entrega '+model.delivery_number);
            }
        });
        if(event.event === 'creation')
            Notification.event_server_pickup_message('Entrega creada número'+event.data.delivery_number);
        if(event.event === 'actualization')
            Notification.event_server_pickup_message('Entrega '+event.data.delivery_number+' actualizada');
    }

    function delete_event_in_server(model){
        AjaxQueue.add({
            type: 'post',
            url: 'courier_event/delete',
            dataType: 'text',
            data: {
                id: model.id,
            },
            successful_online: function(response){},
            failed_online: function(jqXHR, textStatus){},
            successful_offline: function(response){},
            failed_offline: function(jqXHR, textStatus){}
        });
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            get_events_from_server                : get_events_from_server,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
