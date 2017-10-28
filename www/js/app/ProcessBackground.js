var ProcessBackground= (function () {

    var notify_message= {
        pickups: '',
        deliveries: '',
        main_message: ''
    };

    var index_executionBack= 0;
    var first_execution= true;

    var run= function (){
        //navigator.notification.vibrate([1000]);
        cordova.plugins.backgroundMode.configure({
            text: get_message_to_notification_bar()+' Intento '+index_executionBack
        });
        index_executionBack++;
        first_execution= false;
    };

    function get_message_to_notification_bar() {
        var main_message = (notify_message.main_message !== '') ? notify_message.main_message + "\n" : '';
        return main_message + notify_message.deliveries + "\n" + notify_message.pickups;
    }

    function reload_message_to_notification_bar(callback) {
        try {
            DeliveriesModel.loaded(function(){
                var sin_entregar= DeliveriesModel.find({delivery_state_id: 1}).length;
                if(sin_entregar>0){
                    notify_message.deliveries = 'Sin Entregar ' + sin_entregar;
                }else{
                    notify_message.deliveries = 'Todo ha sido entregado :D';
                }

                PickupModel.loaded(function(){
                    var sin_recoger= PickupModel.find({pickup_state_id: 1}).length;
                    if(sin_recoger>0){
                        notify_message.pickups = 'Sin Recoger ' + sin_recoger;
                    }else{
                        notify_message.pickups = 'Todo ha sido recogido :D';
                    }
                });
                callback();
            });
        }catch (error){
            alert(JSON.stringify(error));
        }
    }

    var hello= function(){
        cordova.plugins.backgroundMode.configure({text: 'entre'});
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            hello                                     : hello,
            run                                     : run,
            reload_message_to_notification_bar      : reload_message_to_notification_bar,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
