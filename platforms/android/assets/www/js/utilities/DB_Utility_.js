var DB_Utility_= (function () {

    var get_set_to_update = function (obj){
        var set= [];
        Object.keys(obj).forEach(function(key) {
            set.push(key+' = ? ');
        });
        return set.join(', ');
    };

    var get_where = function (obj){
        var set= [];
        Object.keys(obj).forEach(function(key) {
            set.push(key+' = ? ');
        });
        if(set.length > 0) return ' WHERE '+set.join(' and ');
        return '';
    };

    var get_keys= function (obj){
        var keys= [];
        Object.keys(obj).forEach(function(key) {
            keys.push(key);
        });
        return keys.join(', ');
    };

    var get_values= function (obj){
        var keys= [];
        Object.keys(obj).forEach(function(key) {
            keys.push(obj[key]);
        });
        return keys;
    };

    var get_interrogations= function (obj){
        var interrogations= [];
        Object.keys(obj).forEach(function(key) {
            interrogations.push('?');
        });
        return interrogations.join(', ');
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            get_values            : get_values,
            get_keys              : get_keys,
            get_interrogations    : get_interrogations,
            get_set_to_update     : get_set_to_update,
            get_where             : get_where
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
