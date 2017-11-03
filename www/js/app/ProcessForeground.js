var ProcessForeground= (function () {

    var index_executionFor= 0;
    var first_execution= true;

    var run= function(){
        if(Process.it_can_be_executed('check_ajax_queue', Settings.timer_check_ajax_queue)){
            check_ajax_queue();
        }
        if(Process.it_can_be_executed('get_events_from_server', Settings.timer_get_events_from_server)){
            Event_server.get_events_from_server();
        }
        if(Process.it_can_be_executed('alert_by_proximity', Settings.timer_run_alert_proximity)){
            Alert_proximity.run();
        }
        if(Process.it_can_be_executed('alert_by_time', Settings.timer_run_alert_time)){
            Alert_time.run();
        }
        index_executionFor++;
        first_execution= false;
    };

    function check_ajax_queue(){
        if($('#check_ajax_queue').length > 0 && App.ajax_queue_count>0){
            document.getElementById('check_ajax_queue').dispatchEvent(new Event("click"));
            Process.store_last_attempt('check_ajax_queue');
        }
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            run            : run,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
