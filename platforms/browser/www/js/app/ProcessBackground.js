var ProcessBackground= (function () {

    var notify_message= {
        pickups: '',
        deliveries: '',
        main_message: '',
        complete: ''
    };

    var index_executionBack= 0;
    var first_execution= true;

    var run= function (){
        if(first_execution)initialize();
        //navigator.notification.vibrate([1000]);
        index_executionBack++;
        cordova.plugins.backgroundMode.configure({
            text: get_message_to_notification_bar()
        });
        first_execution= false;
    };


    function initialize(){
        reload_message_to_notification_bar();
        cordova.plugins.backgroundMode.setDefaults({
            title: 'Courier App',
            text: get_message_to_notification_bar(),
            //icon: 'icon',  this will look for icon.png in platforms/android/res/drawable|mipmap
            color: '#b3b3ff', // hex format like 'F14F4D'
            resume: true,
            hidden: false,
            bigText: false
        });
    }
    
    function get_message_to_notification_bar() {
        var main_message = (notify_message.main_message !== '') ? notify_message.main_message + "\n" : '';
        return main_message + notify_message.deliveries + "\n" + notify_message.pickups;
    }

    function reload_message_to_notification_bar() {
        try {
            var sin_entregar= DeliveriesModel.find({delivery_state_id: 1}).length;
            var sin_recoger= PickupModel.find({pickup_state_id: 1}).length;

            if(sin_entregar>0){
                notify_message.deliveries = 'Sin Entregar ' + sin_entregar;
            }else{
                notify_message.deliveries = 'Todo ha sido entregado';
            }

            if(sin_entregar>0){
                notify_message.pickups = 'Sin Recoger ' + sin_recoger;
            }else{
                notify_message.pickups = 'Todo ha sido recogido';
            }

        }catch (error){
            alert(JSON.stringify(error));
            //setTimeout(function(){ initialize(); }, 1000);
        }
    }

    var hello= function(){
        cordova.plugins.backgroundMode.configure({text: "Recolecciones 0"});
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            hello                                   : hello,
            run                                     : run,
            reload_message_to_notification_bar      : reload_message_to_notification_bar,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
