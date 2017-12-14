var Operations= (function () {

    var get_data= function (date, callback){
        var callback= PolishedUtility_.callback(callback);
        if(date === undefined)
            date= MomentUtility_.current_date();

        ToastrUtility_.info('Conectando a servidor, espere por favor.');
        var request = $.ajax({
            url: Settings.route_api_pasar("operations_data"),
            type: 'post',
            dataType: "json",
            data: SecurityUtility_.add_user_authenticated({
                date: date
            })
        });
        request.done(function(response){
            try{
                callback.success(response);
                Event_server.clear_events_in_server();
            }catch (e){
                alert('Operations get_data: '+e.message);
            }
        });
        request.fail(function(jqXHR, textStatus) {
            callback.fail(jqXHR, textStatus);
            AjaxUtility_.processFailRequest(jqXHR, textStatus);
        });
    };


    var synchronize_data_operations= function (external_callbacks){
        var external_callbacks= PolishedUtility_.callback(external_callbacks);
        try{
            DeliveriesModel.clearTable({success: function(){
                App.operations.deliveries= [];
                PickupModel.clearTable({success: function(){
                    App.operations.pickups= [];
                    Operations.get_data(MomentUtility_.current_date(), {
                        success: function(response){
                            App.date_to_filter= null;
                            if(!response.deliveries.success){
                                alert(response.deliveries.message);
                            }else {
                                DeliveriesModel.insert_multiple(response.deliveries.data, {success: function () {
                                    DeliveriesModel.get({success: function (tx, results) {
                                        App.operations.deliveries = results._all;
                                    }});
                                }});
                            }
                            if(!response.pickups.success){
                                alert(response.deliveries.message);
                            }else{
                                PickupModel.insert_multiple(response.pickups.data, {success:function(){
                                    PickupModel.get({success: function(tx, results){
                                        App.operations.pickups= results._all;
                                    }});
                                }});
                            }
                            external_callbacks.success();
                        },fail: function(){
                            external_callbacks.fail();
                        }
                    });
                }});
            }});
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

