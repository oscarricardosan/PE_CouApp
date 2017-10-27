var Background_processModel= (function () {

    var collection_name= 'background_processes';

    var loaded_Callback= [];
    var isLoaded= false;

    /**
     * Carga los datos si ya estan en localstorage
     */
    db.collection(collection_name, {capped: true, size: 1}).load(function (err, tableStats, metaStats) {
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
            if (!err) {callback.success();}
            else{callback.fail(); alert('Error al guardar en '+collection_name);}
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
            if (!err) {callback.success();}
            else{callback.fail(); alert('Error al guardar en '+collection_name);}
        });
    };

    var get = function(){
        var records= db.collection(collection_name).find();
        if(records.length===0)
            return null;
        else
            return records[0];
    };

    var isEmpty = function(){
        return get() === null;
    };

    var drop= function(callback){
        var coll = db.collection(collection_name);
        coll.drop(callback());
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
            drop              : drop
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
