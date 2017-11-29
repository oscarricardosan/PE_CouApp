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

    var queue= function (callback){
        callback.success= eval(callback, 'success', function(){});
        callback.fail= eval(callback, 'fail', function(){});
        callback.empty= eval(callback, 'empty', function(){});
        return callback;
    };

    var ajaxQueueProperties= function (raw_properties){
        if(typeof(raw_properties) !== 'object') properties= {};
        else properties= raw_properties;

        properties.type= eval(properties, 'type', 'post');
        properties.dataType= eval(properties, 'dataType', 'json');
        properties.data= eval(properties, 'data', {});

        properties.success= eval(properties, 'success', function(){});
        properties.fail= eval(properties, 'fail', function(){});

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
            queue                 : queue
        }
    };

    return {construct:construct};//retorna los metodos publicos
})().construct();
