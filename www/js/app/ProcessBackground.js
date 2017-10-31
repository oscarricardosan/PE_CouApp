var ProcessBackground= (function () {

    var notify_message= {
        pickups: '',
        deliveries: '',
        main_message: '',
    };

    var index_executionBack= 0;
    var first_execution= true;

    var run= function (){

        if(Process.it_can_be_executed('check_ajax_queue', 5)){
            check_ajax_queue();
        }

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
                    set_main_message_notification_bar('Fallo al transmitir peticiones en cola');
                },
                success: function (properties, response) {
                    App_.ajax_queue_count = Ajax_queueModel.get().length;
                    LogModel.store({
                        message: 'BACKGROUND: Transmisión de petición online a servidor exitosa, procesamiento de cola.',
                        status: 'success',
                        data: {properties: properties, response: response}
                    });
                    set_main_message_notification_bar('Transmision de peticiones en cola exitosa');
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
            DeliveriesModel.loaded(function(){
                sin_entregar= DeliveriesModel.find({delivery_state_id: 1}).length;
                notify_message.deliveries =
                    (sin_entregar>0)?'Sin Entregar ' + sin_entregar:'Todo entregado';

                PickupModel.loaded(function(){
                    sin_recoger= PickupModel.find({pickup_state_id: 1}).length;
                    notify_message.pickups=
                        (sin_recoger>0)?'Sin Recoger ' + sin_recoger:'Todo recogido';

                    if(sin_recoger === 0 && sin_entregar === 0)
                        notify_message.icon= 'success';
                    else if(sin_recoger > 0 && sin_entregar > 0)
                        notify_message.icon= 'danger';
                    else
                        notify_message.icon= 'warning';

                    callback();
                });
            });
        }catch (error){
            alert(JSON.stringify(error));
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
