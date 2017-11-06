var DeliveriesModel= (function () {

    var collection_name= 'deliveries';

    var loaded_Callback= [];
    var isLoaded= false;

    /**
     * Carga los datos si ya estan en localstorage
     */
    db.collection(collection_name, {capped: true, size: 500}).load(function (err, tableStats, metaStats) {
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

        db.collection(collection_name).insert(data);

        db.collection(collection_name).save(function (err) {
            if (!err) {callback.success(data);}
            else{callback.fail(data); alert('Error al guardar en '+collection_name);}
        });
    };

    /**
     * @param where condition
     * @param new_values object
     * @param callback
     */
    var update = function(where, new_values, callback){
        callback= PolishedUtility_.callback(callback);

        db.collection(collection_name).update(where, new_values);

        db.collection(collection_name).save(function (err) {
            if (!err) {callback.success(new_values);}
            else{callback.fail(new_values); alert('Error al guardar en '+collection_name);}
        });
    };

    /**
     * @param data object
     * @param callback
     */
    var insertOrUpdateById = function(data, callback){
        callback= PolishedUtility_.callback(callback);
        if(data.id !== undefined && find({id: data.id}).length === 1)
            store(data, callback);
        else
            update({id: data.id}, data, callback);
    };

    var increment_attemp_gps_alert= function(delivery){
        if(delivery.attempt_gps_alert === undefined)
            delivery.attempt_gps_alert= 1;
        else
            delivery.attempt_gps_alert= delivery.attempt_gps_alert+1;
        update({id: delivery.id}, delivery);
    };

    var get = function(){
        return db.collection(collection_name).find();
    };

    var find = function(where){
        return db.collection(collection_name).find(where);
    };

    var isEmpty = function(){
        return get() === null;
    };

    var drop= function(callback){
        var coll = db.collection(collection_name);
        coll.drop(callback());
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
            get                        : get,
            find                       : find,
            store                      : store,
            update                     : update,
            loaded                     : loaded,
            isEmpty                    : isEmpty,
            drop                       : drop,
            remove                     : remove,
            insertOrUpdateById         : insertOrUpdateById,
            increment_attemp_gps_alert : increment_attemp_gps_alert
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
