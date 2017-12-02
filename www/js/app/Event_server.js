var Event_server= (function () {

    var pickup_noti_update= [];
    var pickup_noti_new= [];
    var delivery_noti_update= [];
    var delivery_noti_new= [];

    function get_events_from_server() {
        AjaxQueue.add({
            process_name: 'Get events of courier',
            type: 'post',
            url: 'courier_event/get_all',
            dataType: 'json',
            data: {},
            success: function(server_events){
                Ajax_queueModel.remove({url: 'courier_event/get_all'}, function(){});
                Event_server.process_server_events(server_events);
            }
        });
        Process.store_last_attempt('get_events_from_server');
    }
    
    function process_server_events(server_events) {
        $.each(server_events.events, function(index, event){
            if(event.collection === "pickups")process_pickups(event);
            if(event.collection === "deliveries")process_deliveries(event);
        });

        try{
        if(delivery_noti_new.length === 1){
            Notification.event_server_pickup_message(delivery_noti_new[0].message, delivery_noti_new[0].title, delivery_noti_new[0].data);
        }else if(delivery_noti_new.length > 1){
            Notification.event_server_pickup_message(delivery_noti_new.length+' nuevas entregas.');
        }

        if(delivery_noti_update.length === 1){
            Notification.event_server_pickup_message(delivery_noti_update[0].message, delivery_noti_update[0].title, delivery_noti_update[0].data);
        }else if(delivery_noti_update.length > 1){
            Notification.event_server_pickup_message(delivery_noti_update.length+' entregas actualizadas.');
        }

        if(pickup_noti_new.length === 1){
            Notification.event_server_pickup_message(pickup_noti_new[0].message, pickup_noti_new[0].title, pickup_noti_new[0].data);
        }else if(pickup_noti_new.length > 1){
            Notification.event_server_pickup_message(pickup_noti_new.length+' nuevas recolecciones.');
        }

        if(pickup_noti_update.length === 1){
            Notification.event_server_pickup_message(pickup_noti_update[0].message, pickup_noti_update[0].title, pickup_noti_update[0].data);
        }else if(pickup_noti_update > 1){
            Notification.event_server_pickup_message(pickup_noti_update.length+' recolecciones actualizadas.');
        }
        }catch (e){ alert(e.message);}
        if(server_events.events.length>0){
            navigator.vibrate([3000, 2000, 3000]);
            navigator.notification.beep(3);
        }
    }
    
    function process_pickups(event) {
        PickupModel.insertOrUpdateById(event.data, {
            success: function(){
                App.operations.pickups= PickupModel.get();
                Event_server.delete_event_in_server(event.id);
            },
            fail: function(){
                Notification.event_server_pickup_danger ('Error procesando evento - '+event.data.pickup_number);
            }
        });
        if(event.event === 'creation')
            pickup_noti_new.push({
                'message': 'Creada número '+event.data.pickup_number+' / '+event.data.pickup_date,
                'title': undefined,
                'data': {action: 'show_pickup', pickup: event.data}
            });
        if(event.event === 'actualization')
            pickup_noti_update.push({
                'message': event.data.pickup_number+' actualizada'+' / '+event.data.pickup_date,
                'title': undefined,
                'data': {action: 'show_pickup', pickup: event.data}
            });
    }

    function process_deliveries(event){
        DeliveriesModel.insertOrUpdateById(event.data, {
            success: function(){
                App.operations.deliveries= DeliveriesModel.get();
                Event_server.delete_event_in_server(event.id);
            },
            fail: function(){
                Notification.event_server_delivery_danger('Error procesando evento de - '+event.data.delivery_number);
            }
        });
        if(event.event === 'creation')
            delivery_noti_new.push({
                'message': 'Creada número '+event.data.delivery_number+' / '+event.data.delivery_date,
                'title': undefined,
                'data': {action: 'show_delivery', delivery: event.data}
            });
        if(event.event === 'actualization')
            delivery_noti_update.push({
                'message': event.data.delivery_number+' actualizada'+' / '+event.data.delivery_date,
                'title': undefined,
                'data': {action: 'show_delivery', delivery: event.data}
            });
    }

    function delete_event_in_server(id){
        AjaxQueue.add({
            process_name: 'Eliminar evento en servidor',
            type: 'post',
            url: 'courier_event/delete',
            dataType: 'text',
            data: {evento_id: id}
        });
    }

    function clear_events_in_server(){
        AjaxQueue.add({
            process_name: 'Limpiar enventos para courier en servidor. ',
            type: 'post',
            url: 'courier_event/clear',
            dataType: 'text',
            data: {}
        });
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            get_events_from_server                : get_events_from_server,
            clear_events_in_server                : clear_events_in_server,
            process_server_events                 : process_server_events,
            delete_event_in_server                : delete_event_in_server
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
