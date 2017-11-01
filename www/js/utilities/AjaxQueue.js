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
            properties.successful_online(response);
        });
        request.fail(function(jqXHR, textStatus) {
            if(jqXHR.status===422){
                alert(_.pluck(jqXHR.responseJSON.errors, '0').join("\n"));
                return false;
            }
            if(jqXHR.status===403){
                alert('Acceso denegado. '+ jqXHR.responseJSON.message);
                Login.logout();
                return false;
            }
            if(jqXHR.status===401){
                alert('Usuario sin autorización. Revise que la sesión no haya finalizado.');
                return false;
            }
            Ajax_queueModel.store(properties, {
                success: function(){
                    properties.failed_online(jqXHR, textStatus);
                }
            });
        });
    };

    var check_queue= function(callbacks){
        alert("check_queue 1");
        var queues= Ajax_queueModel.get();
        alert("check_queue 2 : "+queues.length);
        if(queues.length===0){
            callbacks.empty();
            return false;
        }
        alert("check_queue 3");
        var properties= PolishedUtility_.ajaxQueueProperties(queues[0]);
        alert("check_queue 4");
        var request = $.ajax({
            url: Settings.route_api_pasar(properties.url),
            type: properties.type,
            dataType: properties.dataType,
            data: SecurityUtility_.add_user_authenticated(properties.data)
        });
        request.done(function(response){
            alert("check_queue 5");
            alert(properties.dataType);
            alert("check_queue 6");
            if(properties.dataType === 'json'){
                alert("1.0");
                if(response.success){
                    alert("1.1.0");
                    properties.successful_offline(response);
                    alert("1.1.1");
                    Ajax_queueModel.remove({_id: properties._id}, function(){
                        AjaxQueue.check_queue(callbacks);
                    });
                    alert("1.1.2");
                    callbacks.success(properties, response);
                    alert("1.1.3");
                }else{
                    alert("1.2.0");
                    callbacks.fail(properties, jqXHR, textStatus);
                    alert("1.2.1");
                    properties.failed_offline(jqXHR, textStatus);
                    alert("1.2.2");
                }
            }else{
                alert("2.0");
                properties.successful_offline(response);
                alert("2.1");
                Ajax_queueModel.remove({_id: properties._id}, function(){
                    AjaxQueue.check_queue(callbacks);
                });
                alert("2.2");
                callbacks.success(properties, response);
                alert("2.3");
            }
            App.ajax_queue_count= Ajax_queueModel.get().length;
        });
        request.fail(function(jqXHR, textStatus) {
            if(jqXHR.status===422){
                alert('Transmisión en cola: '+_.pluck(jqXHR.responseJSON.errors, '0').join("\n"));
                return false;
            }
            if(jqXHR.status===403){
                alert('Transmisión en cola: Acceso denegado. '+ jqXHR.responseJSON.message);
                Login.logout();
                return false;
            }
            if(jqXHR.status===401){
                alert('Transmisión en cola: Usuario sin autorización. Revise que la sesión no haya finalizado.');
                return false;
            }
            callbacks.fail(properties, jqXHR, textStatus);
            properties.failed_offline(jqXHR, textStatus);
            App.ajax_queue_count= Ajax_queueModel.get().length;
        });
    };

    var check_queue_from_element= function(element){
        alert("check_queue_from_element 1");
        element.loading();
        alert("check_queue_from_element 2");
        AjaxQueue.check_queue({
            empty:function(){
                App.ajax_queue_count= Ajax_queueModel.get().length;
                element.unloading();
                ToastrUtility_.success('Cola vacía');
            },
            fail: function(properties, jqXHR, textStatus){
                App.ajax_queue_count= Ajax_queueModel.get().length;
                element.unloading();
                ToastrUtility_.error('Fallo transmisión'+ JSON.stringify({
                    jqXHR: jqXHR, textStatus: textStatus
                }));
                LogModel.store({
                    message: 'Error al transmitir al servidor petición online, procesamiento de cola.',
                    status: 'danger',
                    data:  JSON.stringify({
                        jqXHR: jqXHR, textStatus: textStatus, properties: properties
                    })
                });
            },
            success: function(properties, response){
                App.ajax_queue_count= Ajax_queueModel.get().length;

                LogModel.store({
                    message: 'Transmisión de petición online a servidor exitosa, procesamiento de cola.',
                    status: 'success',
                    data: {properties: properties, response: response}
                });
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
