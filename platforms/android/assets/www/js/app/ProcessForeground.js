var ProcessForeground= (function () {
    var index_executionFor= 0;

    var run= function(){
        //navigator.notification.beep(1);
        index_executionFor++;
        ToastrUtility_.success(
            "ENtrada "+index_executionFor+"\n"+
            "Primer ejecución "+(first_execution?'si':'no')
        )
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            run            : run,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
