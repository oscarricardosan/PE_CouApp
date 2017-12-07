var DB_Utility_= (function () {

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
            get_interrogations    : get_interrogations
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
