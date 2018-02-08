var ProcessForeground= (function () {

    var index_executionFor= 0;
    var first_execution= true;

    var run= function(){

        Process.it_can_be_executed('check_ajax_queue', Settings.timer_check_ajax_queue, {yes: function(){
            try{
                check_ajax_queue();
            }catch (e){
                alert('Foreground check_ajax_queue: '+e.message);
            }
        }});

        Process.it_can_be_executed('get_events', Settings.timer_get_events_from_server, {yes: function(){
            try{
                Event_server.get_events_from_server();
            }catch (e){
                alert('Foreground get_events: '+e.message);
            }
        }});

        Process.it_can_be_executed('proximity_alert', Settings.timer_run_alert_proximity, {yes: function(){
            try{
                Alert_proximity.run();
            }catch (e){
                alert('Foreground proximity_alert: '+e.message);
            }
        }});

        Process.it_can_be_executed('time_alert', Settings.timer_run_alert_time, {yes: function(){
            try{
                Alert_time.run();
            }catch (e){
                alert('Foreground time_alert: '+e.message);
            }
        }});

        index_executionFor++;
        first_execution= false;
    };

    function check_ajax_queue(){
        if($('#check_ajax_queue').length > 0 && App.ajax_queue_count>0 && AjaxQueue.is_running() === false){
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
