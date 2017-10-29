var ProcessBackground= (function () {

    var notify_message= {
        pickups: '',
        deliveries: '',
        main_message: '',
        icon: '',
    };

    var index_executionBack= 0;
    var first_execution= true;

    var run= function (){
        //navigator.notification.vibrate([1000]);
        cordova.plugins.backgroundMode.configure({
            text: get_message_to_notification_bar(),
            icon: notify_message.icon
        });
        index_executionBack++;
        first_execution= false;
    };

    function get_message_to_notification_bar() {
        var main_message = (notify_message.main_message !== '') ? notify_message.main_message + "\n" : '';
        return main_message + notify_message.deliveries + "\n" + notify_message.pickups;
    }

    function reload_message_to_notification_bar(callback) {
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
                        notify_message.icon= '/images/success.png';
                    else if(sin_recoger > 0 && sin_entregar > 0)
                        notify_message.icon= '/images/danger.png';
                    else
                        notify_message.icon= '/images/warning.png';

                    callback();
                });
            });
        }catch (error){
            alert(JSON.stringify(error));
        }
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            run                                     : run,
            reload_message_to_notification_bar      : reload_message_to_notification_bar,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
