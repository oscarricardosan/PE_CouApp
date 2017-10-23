var PolishedUtility_= (function () {

    var callback= function (callback){
        if(typeof(callback) !== 'object')
           return {success: function(){}, fail: function(){}};
        if(callback.success == undefined)
            callback.success= function(){};
        if(callback.fail == undefined)
            callback.fail= function(){};
        return callback;
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            callback           : callback,
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
