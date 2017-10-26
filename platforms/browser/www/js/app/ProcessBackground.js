var ProcessBackground= (function () {

    var index_executionBack= 0;
    var first_execution= true;

    var run= function (){
        //navigator.notification.vibrate([1000]);
        index_executionBack++;
        cordova.plugins.backgroundMode.configure({
            text:
            "ENtrada "+index_executionBack+"\n"+
            "Primer ejecución "+(first_execution?'si':'no')
        });
        first_execution= false;
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            run            : run,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
