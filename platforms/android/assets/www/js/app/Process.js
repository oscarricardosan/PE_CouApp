var Process= (function () {

    /**
     * @param process
     * @param callback
     */
    var store_last_attempt = function(process, callback){
        var process_= {};
        process_[process]= moment().unix();
        ProcessModel.update({id: 1}, process_, callback);
    };

    function it_can_be_executed(process, minutes, callback) {
        ProcessModel.get({success:function(tx, results){
            var last_execution= minutes_since_last_execution(results._first[process]);
            if(last_execution>=minutes || last_execution === undefined){
                callback.yes();
            }else{
                if(callback.no !== undefined)
                    callback.no();
            }

        }});
    }

    var minutes_since_last_execution = function(time){
        var seconds= seconds_since_last_execution(time);
        if(time === undefined || time === null) return undefined;
        if(seconds <= 0) return 0;
        return parseInt(seconds / 60);
    };

    var seconds_since_last_execution = function(time){
        if(time === undefined || time === null) return undefined;
        else
            return moment().unix() - time;
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            store_last_attempt             : store_last_attempt,
            seconds_since_last_execution   : seconds_since_last_execution,
            minutes_since_last_execution   : minutes_since_last_execution,
            it_can_be_executed             : it_can_be_executed
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
