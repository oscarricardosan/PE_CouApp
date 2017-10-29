var ProcessForeground= (function () {

    var index_executionFor= 0;
    var first_execution= true;

    var run= function(){
        //navigator.notification.beep(1);
        ToastrUtility_.warning('Ejecución');
        if(Background_process.it_can_be_executed('check_ajax_queue', 5)){
            ToastrUtility_.success('5 minutos o ninguna');
            check_ajax_queue();
        }

        index_executionFor++;
        first_execution= false;
    };

    function check_ajax_queue(){
        if($('#check_ajax_queue').length > 0 && App.ajax_queue_count>0){
            document.getElementById('check_ajax_queue').dispatchEvent(new Event("click"));
        }
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            run            : run,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
