var LogModel= (function () {

    var collection_name= 'log';

    var loaded_Callback= [];
    var isLoaded= false;

    /**
     * Carga los datos si ya estan en localstorage
     */
    db.collection(collection_name, {capped: true, size: 20}).load(function (err, tableStats, metaStats) {
        if (!err) {
            $.each(loaded_Callback, function(){
                this();
            });
            isLoaded= true;
        }else{
            alert('Error al cargar colección '+collection_name)
        }
    });

    /**
     * @param data
     * @param callback
     */
    var store = function(data, callback){
        callback= PolishedUtility_.callback(callback);

        data.created_at= MomentUtility_.now();
        db.collection(collection_name).insert(data);

        db.collection(collection_name).save(function (err) {
            if (!err) {callback.success();}
            else{callback.fail(); alert('Error al guardar en '+collection_name);}
        });
    };

    var store_success= function(message, data, callback){
        store({
            message: message,
            data: data,
            status: 'success'
        }, callback);
    };

    var store_fail= function(message, data, callback){
        store({
            message: message,
            data: data,
            status: 'danger'
        }, callback);
    };

    var get = function(){
        var records= db.collection(collection_name).find();
        return records;
    };

    var isEmpty = function(){
        return get() === null;
    };

    var drop= function(callback){
        db.collection(collection_name).drop(function(){
            callback()
            db.collection(collection_name).save(function (err) {
                if (!err){
                    if(typeof(callback) === 'function'){callback();}
                }else{
                    alert('Error al eliminar colección '+collection_name);
                }
            });
        });
    };

    var remove= function(where, callback){
        var where= where===undefined?{}:where;
        db.collection(collection_name).remove(
            where,
            function(){
                db.collection(collection_name).save(function (err) {
                    if (!err){
                        if(typeof(callback) === 'function'){callback();}
                    }else{
                        alert('Error al borrar en colección '+collection_name);
                    }
                });
            }
        );
    };

    var loaded= function(callback){
        if(isLoaded)
            callback();
        else
            loaded_Callback.push(callback);
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            get               : get,
            store             : store,
            loaded            : loaded,
            isEmpty           : isEmpty,
            drop              : drop,
            remove            : remove,
            store_success     : store_success,
            store_fail        : store_fail
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
