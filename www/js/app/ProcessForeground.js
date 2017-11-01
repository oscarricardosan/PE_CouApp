var ProcessForeground= (function () {

    var index_executionFor= 0;
    var first_execution= true;

    var run= function(){
        alert('Timer: '+Settings.timer_check_ajax_queue);
        if(Process.it_can_be_executed('check_ajax_queue', Settings.timer_check_ajax_queue)){
            alert('entre a queue');
            try{
            check_ajax_queue();
            }catch (error){ alert("Error queue: "+error.message);}
            alert('sali de queue');
        }
        index_executionFor++;
        first_execution= false;
    };

    function check_ajax_queue(){
        alert('Length: '+$('#check_ajax_queue').length);
        alert('Conteo cola: '+App.ajax_queue_count);
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
