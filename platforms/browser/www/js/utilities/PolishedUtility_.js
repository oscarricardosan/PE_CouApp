var PolishedUtility_= (function () {

    var callback= function (callback){
        if(typeof(callback) !== 'object')
           return {success: function(){}, fail: function(){}};
        if(callback.success === undefined)
            callback.success= function(){};
        if(callback.fail === undefined)
            callback.fail= function(){};
        return callback;
    };

    var ajaxQueueProperties= function (raw_properties){
        if(typeof(raw_properties) !== 'object') properties= {};
        else properties= raw_properties;

        properties.type= eval(properties, 'type', 'post');
        properties.dataType= eval(properties, 'dataType', 'json');
        properties.data= eval(properties, 'data', {});

        properties.successful_online= eval(properties, 'successful_online', function(response){
            if(response.success)
                ToastrUtility_.success(response.message);
            else
                ToastrUtility_.error(response.message);
        });
        properties.failed_online= eval(properties, 'failed_online', function(jqXHR, textStatus){
            ToastrUtility_.warning(jqXHR.responseJSON.message+" \nSin conexion a servidor, se transmitira más tarde.");
        });


        properties.successful_offline= eval(properties, 'successful_offline', function(){
            LogModel.store({
                message: 'Error al transmitir al servidor petición offline.',
                status: 'success',
                data: properties
            });
        });
        properties.failed_offline= eval(properties, 'failed_offline', function(){
            LogModel.store({
                message: 'Error al transmitir al servidor petición offline.',
                status: 'fail',
                data: properties
            });
        });

        return properties;
    };

    var eval= function(object, attribute, default_value){
        if(object[attribute] === undefined)
            return default_value;
        else
            return object[attribute];
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            callback              : callback,
            ajaxQueueProperties   : ajaxQueueProperties,
        }
    };

    return {construct:construct};//retorna los metodos publicos
})().construct();
