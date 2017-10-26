var ProcessBackground= (function () {

    var notify_message= {
        pickups: '',
        deliveries: '',
        main_message: ''
    };

    var index_executionBack= 0;
    var first_execution= true;

    var run= function (){
        if(first_execution)initialize();
        //navigator.notification.vibrate([1000]);
        index_executionBack++;
        cordova.plugins.backgroundMode.configure({
            text:
            "ENtrada "+index_executionBack+"\n"+
            "Primer ejecución "+(first_execution?'si':'no')
        });
        first_execution= false;
    };


    function initialize(){

        cordova.plugins.backgroundMode.setDefaults({
            title: 'Courier App',
            text: load_message_to_notification_bar(),
            //icon: 'icon',  this will look for icon.png in platforms/android/res/drawable|mipmap
            color: '#b3b3ff', // hex format like 'F14F4D'
            resume: true,
            hidden: false,
            bigText: false
        });
    }
    
    function load_message_to_notification_bar() {
        try {
            notify_message.deliveries = 'Sin Entregar ' + DeliveriesModel.find({delivery_state_id: 1}).length;
            notify_message.pickups = 'Sin Recoger ' + PickupModel.find({pickup_state_id: 1}).length;

            var main_message = (notify_message.main_message !== '') ? notify_message.main_message + "\n" : '';

            return main_message + notify_message.deliveries + "\n" + notify_message.pickups;
        }catch (e){
            setTimeout(function(){ initialize(); }, 1000);
        }
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            run                                     : run,
            load_message_to_notification_bar        : load_message_to_notification_bar,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
