var ProcessBackground= (function () {

    var index_executionBack= 0;
    var first_execution= true;
    var message= {
        delivery_message: 'Sin entregar NN',
        pickup_message: 'Sin recoger NN',
        main: '',
    };

    var reload_bar_message= function(callback){
        cordova.plugins.backgroundMode.configure({
            text: 'reload bar message'
        });
        DeliveriesModel.loaded(function(){

cordova.plugins.backgroundMode.configure({text: 'Deliveries loaded 1'});
            var sin_entregar= DeliveriesModel.find({delivery_state_id: 1}).length;
cordova.plugins.backgroundMode.configure({text: 'Deliveries loaded 2'});
            message.delivery_message=
                (sin_entregar>0)?'Sin entregar '+sin_entregar: 'Entregas al dia :D ';
cordova.plugins.backgroundMode.configure({text: 'Deliveries loaded 3'});
            PickupModel.loaded(function(){
cordova.plugins.backgroundMode.configure({text: 'Pickups loaded 1'});
                var sin_recoger= PickupModel.find({pickup_state_id: 1}).length;
cordova.plugins.backgroundMode.configure({text: 'Pickups loaded 2'});
                message.pickup_message=
                    (sin_recoger>0)?'Sin recoger '+sin_recoger: 'Recolecciones al dia :D ';
                callback();
cordova.plugins.backgroundMode.configure({text: 'Pickups loaded 3'});
            });
        });
    };

    function set_main_bar_message(message) {
        message.main= message;
    }

    function get_bar_message() {
        return (message.main!== ''?message.main+"\n":'')+message.delivery_message+"\n"+message.pickup_message;
    }


    var run= function (){
cordova.plugins.backgroundMode.configure({text: 'Run'});
        cordova.plugins.backgroundMode.configure({
            text: get_bar_message()+"\n Intento: "+index_executionBack
        });

        index_executionBack++;
        first_execution= false;
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            run                        : run,
            reload_bar_message         : reload_bar_message,
            set_main_bar_message       : set_main_bar_message,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
