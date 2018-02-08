var Ajax_queueModel= (function () {

    var table= 'ajax_queue';

    var insert= function(data, callback){
        callback= PolishedUtility_.callback_SQLinsert(callback);
        data.data= JSON.stringify(data.data);
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

    var countRaw = function(where, callback){
        if(where != '')
            where= ' WHERE '+where;
        callback= PolishedUtility_.callback_SQLcount(callback);
        DB.transaction(function(transaction) {
            transaction.executeSql('SELECT count(*) as count FROM '+table+where, [], callback.success, callback.fail);
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
        callback= PolishedUtility_.callback_SQUpdate(callback);
        DB.transaction(function (tx) {
            tx.executeSql(
                "DELETE from "+table+DB_Utility_.get_where(where),
                DB_Utility_.get_values(where),
                callback.success,
                callback.fail
            );
        }, function(error) {
            alert('Transaction '+table+' :' + error.message);
        }, function() {
            //alert('transaction ok');
        });
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            get               : get,
            find              : find,
            countRaw          : countRaw,
            findRaw           : findRaw,
            insert            : insert,
            clearTable        : clearTable,
            remove            : remove
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
