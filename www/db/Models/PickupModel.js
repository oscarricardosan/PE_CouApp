var PickupModel= (function () {

    var table= 'pickups';

    var insert= function(data, callback){
        callback= PolishedUtility_.callback_SQLinsert(callback);
        DB.transaction(function (tx) {
            tx.executeSql(
                "INSERT INTO "+table+" ("+DB_Utility_.get_keys(data)+") VALUES ("+DB_Utility_.get_interrogations(data)+")",
                DB_Utility_.get_values(data),
                callback.success,
                callback.fail
            );
        }, function(error) {
            alert('Transaction '+table+' :' + error.message);
        }, function() {
            //alert('transaction ok');
        });
    };

    var insert_multiple= function(data, callback){
        callback= PolishedUtility_.callback_SQLinsert_multiple(callback);
        var inserts= [];
        $.each(data, function(){
            inserts.push(
                ["INSERT INTO "+table+" ("+DB_Utility_.get_keys(this)+") VALUES ("+DB_Utility_.get_interrogations(this)+")",
                DB_Utility_.get_values(this)]
            );
        });
        DB.sqlBatch(inserts, function() {
            callback.success();
        }, function(error) {
            callback.fail(error);
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
            update({id: data.id}, data, callback);
        else
            store(data, callback);
    };

    var increment_attemp_gps_alert= function(pickup){
        if(pickup.attempt_gps_alert === undefined)
            pickup.attempt_gps_alert = 1;
        else
            pickup.attempt_gps_alert= pickup.attempt_gps_alert+1;
        update({id: pickup.id}, pickup);
    };

    var get = function(callback){
        callback= PolishedUtility_.callback_SQLselect(callback);
        DB.transaction(function(transaction) {
            transaction.executeSql('SELECT * FROM '+table, [], callback.success, callback.fail);
        }, function(error) {
            alert('Transaction '+table+' :' + error.message);
        }, function() {
            //alert('transaction ok');
        });
    };

    var find = function(where){
        return db.collection(collection_name).find(where);
    };

    var isEmpty = function(){
        return get() === null;
    };

    var clearTable= function(callback){
        callback= PolishedUtility_.callback(callback);
        DB.transaction(function(transaction) {
            transaction.executeSql('DELETE FROM '+table, [], callback.success,
                function(){alert('Error al eliminar tabla '+table)}
            );
        }, function(error) {
            alert('Transaction '+table+' :' + error.message);
        }, function() {
            //alert('transaction ok');
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

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            get                        : get,
            find                       : find,
            insert                     : insert,
            insert_multiple            : insert_multiple,
            isEmpty                    : isEmpty,
            clearTable                 : clearTable,
            remove                     : remove,
            update                     : update,
            insertOrUpdateById         : insertOrUpdateById,
            increment_attemp_gps_alert : increment_attemp_gps_alert,
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
