var UrlUtility_= (function () {


    var getParams= function (){

        var urlParams;
        (window.onpopstate = function () {
            var match,
                pl     = /\+/g,  // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
                query  = window.location.search.substring(1);

            urlParams = {};
            while (match = search.exec(query))
                urlParams[decode(match[1])] = decode(match[2]);
        })();
        return urlParams;
    };

    var getParam= function (param){
        urlParams= getParams();
        if(param in urlParams){
            return urlParams[param];
        }else{
            return null;
        }
    };

    var setParam= function (name, value){
        current_url= window.location.href.split('?');

        urlParams= getParams();
        urlParams[name]= value;
        paramsJoin= _.map(urlParams, function(value, name){ return name+'='+value; });
        history.pushState({}, null, current_url[0]+'?'+paramsJoin.join('&'));
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            getParams           : getParams,
            setParam            : setParam,
            getParam            : getParam
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
