var AjaxQueue= (function () {

    var add= function(properties){
        properties= PolishedUtility_.ajaxQueueProperties(properties);
        properties.created_at= MomentUtility_.now();
        var request = $.ajax({
            url: Settings.route_api_pasar(properties.url),
            type: properties.type,
            dataType: properties.dataType,
            data: SecurityUtility_.add_user_authenticated(properties.data)
        });
        request.done(function(response){
            if(properties.dataType === 'json'){
                if(response.success){
                    properties.success(response, properties);
                    LogModel.store_success(properties.process_name, response);
                }else{
                    var data= {properties: properties, response: response};
                    properties.fail(data);
                    LogModel.store_fail(properties.process_name, data);
                }
            }else{
                properties.success(response, properties);
                LogModel.store_success(properties.process_name, response);
            }
        });
        request.fail(function(jqXHR, textStatus) {
            var data= {properties: properties, textStatus: textStatus, jqXHR: jqXHR};
            LogModel.store_fail(properties.process_name, data);
            Ajax_queueModel.store(properties, {success: function(){properties.fail(data);}});
            App.ajax_queue_count= Ajax_queueModel.get().length;
            validate_request_fail(jqXHR);
        });
    };

    var check_queue= function(callbacks){
        var queues= Ajax_queueModel.get();
        callbacks= PolishedUtility_.queue(callbacks);
        if(queues.length===0){
            callbacks.empty();
            return false;
        }
        var properties= PolishedUtility_.ajaxQueueProperties(queues[0]);
        var request = $.ajax({
            url: Settings.route_api_pasar(properties.url),
            type: properties.type,
            dataType: properties.dataType,
            data: SecurityUtility_.add_user_authenticated(properties.data)
        });
        request.done(function(response){
            if(properties.dataType === 'json'){
                if(response.success){
                    properties.success(response, properties);
                    callbacks.success(response, properties);
                    LogModel.store_success(properties.process_name, response);
                    Ajax_queueModel.remove({_id: properties._id}, function(){AjaxQueue.check_queue(callbacks);});
                }else{
                    var data= {properties: properties, response: response};
                    properties.fail(data);
                    callbacks.fail(data);
                    LogModel.store_fail(properties.process_name, data);
                }
            }else{
                callbacks.success(response, properties);
                properties.success(response, properties);
                LogModel.store_success(properties.process_name, response);
                Ajax_queueModel.remove({_id: properties._id}, function(){AjaxQueue.check_queue(callbacks);});
            }
            App.ajax_queue_count= Ajax_queueModel.get().length;
        });
        request.fail(function(jqXHR, textStatus) {
            var data= {properties: properties, textStatus: textStatus, jqXHR: jqXHR};
            LogModel.store_fail(properties.process_name, data);
            App.ajax_queue_count= Ajax_queueModel.get().length;
            validate_request_fail(jqXHR);
            properties.fail(data);
            callbacks.fail(data);
        });
    };

    function validate_request_fail(jqXHR){
        console.log(jqXHR.responseJSON);
        if(jqXHR.status===422){
            if(typeof jqXHR.responseJSON === 'object')
                Alert_('Queue: '+_.pluck(jqXHR.responseJSON.errors, '0').join("\n"));
            else
                Alert_('Queue: Error de validació en campos');
            return false;
        }
        if(jqXHR.status===403){
            Alert_('Queue: Acceso denegado.');
            Login.logout();
            return false;
        }
        if(jqXHR.status===401){
            Alert_('Queue: Usuario sin autorización. Revise que la sesión no haya finalizado.');
            return false;
        }
    }

    var check_queue_from_element= function(element){
        element.loading();
        AjaxQueue.check_queue({
            empty:function(){
                App.ajax_queue_count= Ajax_queueModel.get().length;
                element.unloading();
                Alert_('Queue vacía');
            },
            fail: function(data){
                App.ajax_queue_count= Ajax_queueModel.get().length;
                element.unloading();
                Alert_('Fallo transmisión queue');
            },
            success: function(data){
                App.ajax_queue_count= Ajax_queueModel.get().length;
            }
        });
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            add                         : add,
            check_queue                 : check_queue,
            check_queue_from_element    : check_queue_from_element,
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
