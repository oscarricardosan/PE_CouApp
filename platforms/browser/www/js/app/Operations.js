var Operations= (function () {

    var get_data= function (date, callback){
        var callback= PolishedUtility_.callback(callback);
        if(date === undefined)
            date= MomentUtility_.current_date();

        ToastrUtility_.info('Conecatando a servidor, espere por favor.');
        var request = $.ajax({
            url: Settings.route_api_pasar("operations_data"),
            type: 'post',
            dataType: "json",
            data: SecurityUtility_.add_user_authenticated({
                date: date
            })
        });
        request.done(function(response){
            ToastrUtility_.success('Conexión exitosa.');
            callback.success(response);
            Event_server.clear_events_in_server();
        });
        request.fail(function(jqXHR, textStatus) {
            callback.fail(jqXHR, textStatus);
            AjaxUtility_.processFailRequest(jqXHR, textStatus);
        });
    };


    var synchronize_data_operations= function (external_callbacks){
        var external_callbacks= PolishedUtility_.callback(external_callbacks);
        try{
            Operations.get_data(MomentUtility_.current_date(), {
                success: function(response){
                    App.date_to_filter= null;
                    if(!response.deliveries.success){
                        alert(response.deliveries.message);
                    }else{
                        DeliveriesModel.remove({}, function(){
                            App.operations.deliveries= [];
                            DeliveriesModel.store(response.deliveries.data, {
                                success:function(){
                                    App.operations.deliveries= DeliveriesModel.get();
                                }
                            });

                        });
                    }

                    if(!response.pickups.success){
                        alert(response.deliveries.message);
                    }else{
                        PickupModel.remove({}, function(){
                            App.operations.pickups= [];
                            PickupModel.store(response.pickups.data, {
                                success:function(){
                                    App.operations.pickups= PickupModel.get();
                                }
                            });
                        });
                    }
                    external_callbacks.success();

                },fail: function(){
                    external_callbacks.fail();
                }
            });
        }catch(e){alert(e.message);}
    };


    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            get_data                     : get_data,
            synchronize_data_operations  : synchronize_data_operations,

        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();

