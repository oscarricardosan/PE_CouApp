var PrinterModel= (function () {
    //Size 1

    var table= 'setting_printer';

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

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            get               : get,
            insert            : insert,
            isEmpty           : isEmpty,
            clearTable        : clearTable
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
