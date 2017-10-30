var Process= (function () {

    var seconds_since_last_execution = function(process){
        var background_processes= polish_property(process);
        if(background_processes[process] === undefined) return undefined;
        else if(background_processes[process].last_attempt === undefined) return undefined;
        else
            return moment().unix() - background_processes[process].last_attempt;
    };

    var minutes_since_last_execution = function(process){
        var seconds= seconds_since_last_execution(process);
        if(seconds === undefined) return undefined;
        if(seconds <= 0) return 0;
        return parseInt(seconds / 60);
    };

    /**
     * @param process
     * @param callback
     */
    var store_last_attempt = function(process, callback){
        var background_processes= polish_property(process);
        background_processes[process].last_attempt= moment().unix();

        console.log(background_processes);
        if(background_processes._id === undefined){
            ProcessModel.store(background_processes, callback);
        }else{
            ProcessModel.update({_id: background_processes._id}, background_processes, callback);
        }
    };

    function polish_property(process) {
        var background_processes= ProcessModel.get();
        if(background_processes === null)background_processes= {};
        if(background_processes[process] === undefined)background_processes[process]= {};
        return background_processes;
    }


    function it_can_be_executed(process, minutes) {
        var last_execution= minutes_since_last_execution('check_ajax_queue');
        return last_execution>=minutes || last_execution === undefined;
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            store_last_attempt             : store_last_attempt,
            seconds_since_last_execution   : seconds_since_last_execution,
            minutes_since_last_execution   : minutes_since_last_execution,
            it_can_be_executed             : it_can_be_executed,
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
