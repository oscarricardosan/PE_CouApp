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

    var callback_SQLselect= function (callback){
        if(typeof(callback) !== 'object')
           return {success: function(tx, results){}, fail: function(tx, e){alert("ERROR Select: " + e.message);}};
        if(callback.success === undefined)
            callback.success= function(tx, results){};
        if(callback.fail === undefined)
            callback.fail= function(tx, e){alert("ERROR Select: " + e.message);};
        callback._success= callback.success;
        callback.success= function(tx, results){
            results = PolishedUtility_.callback_SQLresults(results);
            callback._success(tx, results);
        };
        return callback;
    };

    var callback_SQLinsert= function (callback){
        if(typeof(callback) !== 'object')
           return {success: function(tx, results){}, fail: function(tx, e){alert("ERROR insert: " + e.message);}};
        if(callback.success === undefined)
            callback.success= function(tx, results){};
        if(callback.fail === undefined)
            callback.fail= function(tx, e){alert("ERROR insert: " + e.message);};
        callback._success= callback.success;
        callback.success= function(tx, results){
            results = PolishedUtility_.callback_SQLresults(results);
            callback._success(tx, results);
        };
        return callback;
    };

    var callback_SQLresults= function (results){
        results._first= results.rows.item(0);//Si esta vacio _first es undefined
        results._number_rows= results.rows.length;

        var records= [];
        for(var x = 0; x < results.rows.length; x++) {
            records.push(results.rows.item(x));
        }
        results._all= records;
        return results;
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
            queue                 : queue,
            callback_SQLselect    : callback_SQLselect,
            callback_SQLinsert    : callback_SQLinsert,
            callback_SQLresults   : callback_SQLresults,
        }
    };

    return {construct:construct};//retorna los metodos publicos
})().construct();
