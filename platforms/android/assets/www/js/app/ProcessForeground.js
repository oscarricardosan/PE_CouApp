var ProcessForeground= (function () {

    var index_executionFor= 0;
    var first_execution= true;

    var run= function(){
        //navigator.notification.beep(1);
        if($('.check_ajax_queue').length > 0)
            $('.check_ajax_queue').click();
        index_executionFor++;
        first_execution= false;
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            run            : run,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
