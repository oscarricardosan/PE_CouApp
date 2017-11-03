var Event_server= (function () {
    
    function get_events_from_server() {

        AjaxQueue.add({
            type: 'post',
            url: 'courier_event/get_all',
            dataType: 'json',
            data: {},
            successful_online: function(response){
                LogModel.store({
                    message: 'Get events from server: Transmisión de petición online a servidor exitosa.',
                    status: 'success',
                    data: response
                });
                process_server_events(server_events);
            },
            failed_online: function(jqXHR, textStatus){
                LogModel.store({
                    message: 'Get events from server: Error al transmitir al servidor petición online.',
                    status: 'danger',
                    data: {jqXHR: jqXHR, textStatus: textStatus}
                });
                AjaxUtility_.processFaillRequestWithLocalNotification(jqXHR, textStatus);
            },
            successful_offline: function(response){
                LogModel.store({
                    message: 'Get events from server: Transmisión de petición offline a servidor exitosa.',
                    status: 'success',
                    data: response
                });
                process_server_events(server_events);
            },
            failed_offline: function(jqXHR, textStatus){
                LogModel.store({
                    message: 'Get events from server: Error al transmitir al servidor petición offline.',
                    status: 'danger',
                    data: {jqXHR: jqXHR, textStatus: textStatus}
                });
                AjaxUtility_.processFaillRequestWithLocalNotification(jqXHR, textStatus);
            }
        });
        Process.store_last_attempt('get_events_from_server');
    }
    
    function process_server_events(server_events) {
        $.each(server_events, function(index, event){
            if(event.collection === "pickups")process_pickups(event);
            if(event.collection === "deliveries")process_deliveries(event);
        });
        if(server_events.length>=1){
            navigator.vibrate([3000, 2000, 3000]);
            navigator.notification.beep(3);

            DeliveriesModel.loaded(function(){App.operations.deliveries= DeliveriesModel.get();});
            PickupModel.loaded(function(){App.operations.pickups= PickupModel.get();});
        }
    }
    
    function process_pickups(event) {
        PickupModel.insertOrUpdateById(event.data, {
            success: function(model){
                delete_event_in_server(event.id);
            },
            fail: function(model){
                Notification.event_server_pickup_danger ('Error procesando evento - '+model.pickup_number);
            }
        });
        if(event.event === 'creation')
            Notification.event_server_pickup_message(
                'Creada número '+event.data.pickup_number+' / '+event.data.pickup_date,
                undefined,
                {action: 'show_pickup', pickup: event.data}
            );
        if(event.event === 'actualization')
            Notification.event_server_pickup_message(
                event.data.pickup_number+' actualizada'+' / '+event.data.pickup_date,
                undefined,
                {action: 'show_pickup', pickup: event.data}
            );
    }

    function process_deliveries(event){
        DeliveriesModel.insertOrUpdateById(event.data, {
            success: function(model){
                delete_event_in_server(event.id);
            },
            fail: function(model){
                Notification.event_server_delivery_danger('Error procesando evento de - '+model.delivery_number);
            }
        });
        if(event.event === 'creation')
            Notification.event_server_delivery_message(
                'Creada número '+event.data.delivery_number+' / '+event.data.delivery_date,
                undefined,
                {action: 'show_delivery', delivery: event.data}
            );
        if(event.event === 'actualization')
            Notification.event_server_delivery_message(
                event.data.delivery_number+' actualizada'+' / '+event.data.delivery_date,
                undefined,
                {action: 'show_delivery', delivery: event.data}
            );
    }

    function delete_event_in_server(id){
        AjaxQueue.add({
            type: 'post',
            url: 'courier_event/delete',
            dataType: 'text',
            data: {
                evento_id: id,
            },
            successful_online: function(response){
                LogModel.store({
                    message: 'Delete event server: Transmisión de petición online a servidor exitosa.',
                    status: 'success',
                    data: response
                });
            },
            failed_online: function(jqXHR, textStatus){
                LogModel.store({
                    message: 'Delete event server: Error al transmitir al servidor petición online.',
                    status: 'danger',
                    data: {jqXHR: jqXHR, textStatus: textStatus}
                });
            },
            successful_offline: function(response){
                LogModel.store({
                    message: 'Delete event server: Transmisión de petición offline a servidor exitosa.',
                    status: 'success',
                    data: response
                });
            },
            failed_offline: function(jqXHR, textStatus){
                LogModel.store({
                    message: 'Delete event server: Error al transmitir al servidor petición offline.',
                    status: 'danger',
                    data: {jqXHR: jqXHR, textStatus: textStatus}
                });
            }
        });
    }

    function clear_events_in_server(){
        AjaxQueue.add({
            type: 'post',
            url: 'courier_event/clear',
            dataType: 'text',
            data: {},
            successful_online: function(response){
                LogModel.store({
                    message: 'Clear events in server: Transmisión de petición online a servidor exitosa.',
                    status: 'success',
                    data: response
                });
            },
            failed_online: function(jqXHR, textStatus){
                LogModel.store({
                    message: 'Clear events in server: Error al transmitir al servidor petición online.',
                    status: 'danger',
                    data: {jqXHR: jqXHR, textStatus: textStatus}
                });
            },
            successful_offline: function(response){
                LogModel.store({
                    message: 'Clear events in server: Transmisión de petición offline a servidor exitosa.',
                    status: 'success',
                    data: response
                });
            },
            failed_offline: function(jqXHR, textStatus){
                LogModel.store({
                    message: 'Clear events in server: Error al transmitir al servidor petición offline.',
                    status: 'danger',
                    data: {jqXHR: jqXHR, textStatus: textStatus}
                });
            }
        });
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            get_events_from_server                : get_events_from_server,
            clear_events_in_server                : clear_events_in_server
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
