var ProcessBackground= (function () {

    var notify_message= {
        pickups: '',
        deliveries: '',
        main_message: '',
    };

    var index_executionBack= 0;
    var first_execution= true;

    var run= function (){

        Process.it_can_be_executed('check_ajax_queue', Settings.timer_check_ajax_queue, {yes: function(){
            try{
                check_ajax_queue();
            }catch (e){
                alert('Background check_ajax_queue: '+e.message);
            }
        }});

        Process.it_can_be_executed('get_events', Settings.timer_get_events_from_server, {yes: function(){
            try{
                Event_server.get_events_from_server();
            }catch (e){
                alert('Background get_events: '+e.message);
            }
        }});

        Process.it_can_be_executed('proximity_alert', Settings.timer_run_alert_proximity, {yes: function(){
            try{
                Alert_proximity.run();
            }catch (e){
                alert('Background proximity_alert: '+e.message);
            }
        }});

        Process.it_can_be_executed('time_alert', Settings.timer_run_alert_time, {yes: function(){
            try{
                Alert_time.run();
            }catch (e){
                alert('Background time_alert: '+e.message);
            }
        }});

        cordova.plugins.backgroundMode.configure({text: get_message_to_notification_bar()});
        index_executionBack++;
        first_execution= false;
    };

    function check_ajax_queue() {
        if(App.ajax_queue_count>0) {
            //navigator.vibrate(1000);
            AjaxQueue.check_queue({
                fail: function (properties, jqXHR, textStatus) {
                    App_.ajax_queue_count = Ajax_queueModel.get().length;
                    LogModel.store({
                        message: 'BACKGROUND: Error al transmitir al servidor petición online, procesamiento de cola.',
                        status: 'danger',
                        data: JSON.stringify({
                            jqXHR: jqXHR, textStatus: textStatus, properties: properties
                        })
                    });
                    ProcessBackground.set_main_message_notification_bar('Cola: Fallo transmisión de peticiones');
                },
                success: function (properties, response) {
                    App_.ajax_queue_count = Ajax_queueModel.get().length;
                    LogModel.store({
                        message: 'BACKGROUND: Transmisión de petición online a servidor exitosa, procesamiento de cola.',
                        status: 'success',
                        data: {properties: properties, response: response}
                    });
                    ProcessBackground.set_main_message_notification_bar('Cola: Petición transmitida');
                },
                empty: function(){
                    var wifi_queues= Ajax_queueModel.find({
                        $or: [{transmit_only_with_WiFi: false}, {transmit_only_with_WiFi: undefined}]
                    });
                    ProcessBackground.set_main_message_notification_bar('Cola vacía. Peticiones pendientes por wifi '+wifi_queues.length);
                }
            });
            Process.store_last_attempt('check_ajax_queue');
        }
    }

    function get_message_to_notification_bar() {
        var main_message = (notify_message.main_message !== '') ? notify_message.main_message + "\n" : '';
        return main_message + notify_message.deliveries + "\n" + notify_message.pickups;
    }

    function reload_message_to_notification_bar(callback) {
        if(callback === undefined)callback= function(){};
        var sin_entregar= 0;
        var sin_recoger= 0;
        try {
            DeliveriesModel.get({success: function(tx, results){
                sin_entregar= _.where(results._all,{state_id: 100}).length + _.where(results._all,{state_id: 50}).length;
                notify_message.deliveries =
                    (sin_entregar>0)?'Sin Entregar ' + sin_entregar:'Todo entregado';

                PickupModel.get({success: function(tx, results){
                    sin_recoger= _.where(results._all,{state_id: 100}).length + _.where(results._all,{state_id: 50}).length;
                    notify_message.pickups=
                        (sin_recoger>0)?'Sin Recoger ' + sin_recoger:'Todo recogido';

                    if(sin_recoger === 0 && sin_entregar === 0)
                        notify_message.icon= 'success';
                    else if(sin_recoger > 0 && sin_entregar > 0)
                        notify_message.icon= 'danger';
                    else
                        notify_message.icon= 'warning';

                    callback();
                }});
            }});
        }catch (error){
            alert('ProcessBackground: '+error.message);
        }
    }

    var set_main_message_notification_bar= function(main_message, timeout){
        timeout= timeout===undefined?60000:timeout;
        notify_message.main_message= main_message;
        reload_message_to_notification_bar();
        setTimeout(function(){
            if(notify_message.main_message= main_message){
                notify_message.main_message= '';
            }
            reload_message_to_notification_bar();
        }, timeout);
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            run                                     : run,
            reload_message_to_notification_bar      : reload_message_to_notification_bar,
            set_main_message_notification_bar       : set_main_message_notification_bar,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
