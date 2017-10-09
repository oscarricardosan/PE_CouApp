var Operations= (function () {

    var get_data= function (date, callback){
        var callback= PolishedUtility_.callback(callback);
        if(date === undefined)
            date= MomentUtility_.current_date();
        var request = $.ajax({
            url: Settings.route_api_pasar("operations_data"),
            type: 'post',
            dataType: "json",
            data: {
                date: date,
                user: SecurityUtility_.get_auth()
            }
        });
        request.done(function(response){
            callback.success(response);
        });
        request.fail(function(jqXHR, textStatus) {
            callback.fail(jqXHR, textStatus);
            AjaxUtility_.processFaillRequest(jqXHR, textStatus);
        });
    };


    var synchronize_data_operations= function (external_callbacks){
        var external_callbacks= PolishedUtility_.callback(external_callbacks);
        Operations.get_data('2017-10-04', {
            success: function(data){
                DeliveriesModel.remove();
                DeliveriesModel.store(data.deliveries);

                PickupModel.remove();
                PickupModel.store(data.pickups);
                external_callbacks.success();

            },fail: function(){
                external_callbacks.fail();
            }
        });
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            get_data                     : get_data,
            synchronize_data_operations  : synchronize_data_operations,

        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();

