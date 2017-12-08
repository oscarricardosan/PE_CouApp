var DeliveriesModel= (function () {

    var table= 'deliveries';

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

    var update = function(where, new_values, callback){
        callback= PolishedUtility_.callback_SQUpdate(callback);
        DB.transaction(function (tx) {
            tx.executeSql(
                "UPDATE "+table+" SET "+DB_Utility_.get_set_to_update(new_values)+' '+DB_Utility_.get_where(where),
                DB_Utility_.get_values(new_values).concat(DB_Utility_.get_values(where)),
                callback.success,
                callback.fail
            );
        }, function(error) {
            alert('Transaction '+table+' :' + error.message);
        }, function() {
            //alert('transaction ok');
        });
    };

    /**
     * @param data object
     * @param callback
     */
    var insertOrUpdateById = function(data, callback){
        callback= PolishedUtility_.callback(callback);
        if(data.id !== undefined && find({id: data.id}).length === 1){
            update({id: data.id}, data, callback);
        }else{
            store(data, callback);
        }
    };

    var increment_attemp_gps_alert= function(delivery){
        var newVal= delivery.attemp_gps_alert===null?1:delivery.attemp_gps_alert;
        newVal['attemp_gps_alert']= attemp_gps_alert;
        update({id: delivery.id}, newVal);
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

    var find = function(where, callback){
        callback= PolishedUtility_.callback_SQLselect(callback);
        DB.transaction(function(transaction) {
            transaction.executeSql('SELECT * FROM '+table+' '+DB_Utility_.get_where(where), [], callback.success, callback.fail);
        }, function(error) {
            alert('Transaction '+table+' :' + error.message);
        }, function() {
            //alert('transaction ok');
        });
    };

    var findRaw = function(where, callback){
        callback= PolishedUtility_.callback_SQLselect(callback);
        DB.transaction(function(transaction) {
            transaction.executeSql('SELECT * FROM '+table+' WHERE '+where, [], callback.success, callback.fail);
        }, function(error) {
            alert('Transaction '+table+' :' + error.message);
        }, function() {
            //alert('transaction ok');
        });
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
            findRaw                    : findRaw,
            insert                     : insert,
            insert_multiple            : insert_multiple,
            update                     : update,
            clearTable                 : clearTable,
            remove                     : remove,
            insertOrUpdateById         : insertOrUpdateById,
            increment_attemp_gps_alert : increment_attemp_gps_alert
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
