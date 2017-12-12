var AjaxQueue= (function () {

    var add= function(properties){
        properties= PolishedUtility_.ajaxQueueProperties(properties);
        properties.created_at= MomentUtility_.now();
        properties.transmit_only_with_WiFi= properties.transmit_only_with_WiFi===undefined?false:properties.transmit_only_with_WiFi;
        properties.transmit_only_with_WiFi= properties.transmit_only_with_WiFi===null?false:properties.transmit_only_with_WiFi;
        if( //Si no importa que la conexión no sea wifi o si tiene que ser wifi y no esta conectado por Wifi
            properties.transmit_only_with_WiFi === false ||
            (properties.transmit_only_with_WiFi === true && navigator.connection.type === Connection.WIFI)
        ){
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
                        LogModel.store_success(properties.process_name, {response: response, properties: properties});
                    }else{
                        var data= {properties: properties, response: {response: response, properties: properties}};
                        LogModel.store_fail(properties.process_name, data);
                        Ajax_queueModel.insert(properties, {success: function(data){
                            properties.fail(typeof properties.data === 'string'?JSON.parse(properties.data):properties.data);
                        }});
                        Ajax_queueModel.countRaw("", {success:function(tx, results) {
                            App.ajax_queue_count= results._count;
                        }});
                    }
                }else{
                    properties.success(response, properties);
                    LogModel.store_success(properties.process_name, {response: response, properties: properties});
                }
            });
            request.fail(function(jqXHR, textStatus) {
                var data= {properties: properties, textStatus: textStatus, jqXHR: jqXHR};
                LogModel.store_fail(properties.process_name, data);
                Ajax_queueModel.insert(properties, {
                    success: function(tx, results){
                        properties.fail(typeof properties.data === 'string'?JSON.parse(properties.data):properties.data);
                    }
                });
                Ajax_queueModel.countRaw("", {success:function(tx, results) {
                    App.ajax_queue_count= results._count;
                }});
                validate_request_fail(jqXHR);
            });
        }else{//Solo se puede por wifi y no hay wifi
            var data= {properties: properties, fail_message: 'Solo transmite con Wifi, conexión actual '+navigator.connection.type};
            LogModel.store_fail(properties.process_name+' solo con Wifi', data);
            Ajax_queueModel.insert(properties, {success: function(data){
                properties.fail(typeof properties.data === 'string'?JSON.parse(properties.data):properties.data);
            }});
            Ajax_queueModel.countRaw("", {success:function(tx, results) {
                App.ajax_queue_count= results._count;
            }});
        }
    };

    var check_queue= function(callbacks_first){
        if(navigator.connection.type === Connection.WIFI){
            Ajax_queueModel.get({success:function(tx, results) {
                process_quee(callbacks_first, results._all);
            }});
        }else{
            Ajax_queueModel.findRaw("transmit_only_with_wifi= 'false' or transmit_only_with_wifi is null", {
                success:function(tx, results) {
                    process_quee(callbacks_first, results._all);
                }
            });
        }
    };

    function process_quee(callbacks, queues){
        callbacks= PolishedUtility_.queue(callbacks);
        if(queues.length===0){
            callbacks.empty();
            return false;
        }
        var properties= PolishedUtility_.ajaxQueueProperties(queues[0]);
        properties.data= (typeof properties.data === 'string')?JSON.parse(properties.data):properties.data;
        var request = $.ajax({
            url: Settings.route_api_pasar(properties.url),
            type: properties.type,
            dataType: properties.dataType,
            data: SecurityUtility_.add_user_authenticated(properties.data)
        });
        request.done(function (response) {
            var data= (typeof properties.data === 'string')?JSON.parse(properties.data):properties.data;
            if (properties.dataType === 'json') {
                if (response.success) {
                    eval("false||"+properties.success)(response, properties);
                    callbacks.success(response, properties);
                    LogModel.store_success(properties.process_name, {response: response, properties: properties});
                    Ajax_queueModel.remove({id: properties.id}, {success: function () {
                        Ajax_queueModel.countRaw("", {success:function(tx, results) {
                            App.ajax_queue_count= results._count;
                        }});
                        AjaxQueue.check_queue(callbacks);
                    }});
                } else {
                    eval("false||"+properties.fail)(data);
                    callbacks.fail(data);
                    LogModel.store_fail(properties.process_name, {properties: properties, response: response});
                }
            } else {
                eval("false||"+properties.success)(response, properties);
                callbacks.success(response, properties);
                LogModel.store_success(properties.process_name, {response: response, properties: properties});
                Ajax_queueModel.remove({id: properties.id}, {success: function () {
                    Ajax_queueModel.countRaw("", {success:function(tx, results) {
                        App.ajax_queue_count= results._count;
                    }});
                    AjaxQueue.check_queue(callbacks);
                }});
            }
        });
        request.fail(function (jqXHR, textStatus) {
            LogModel.store_fail(properties.process_name, {
                properties: properties, textStatus: textStatus, jqXHR: jqXHR
            });
            Ajax_queueModel.countRaw("", {success:function(tx, results) {
                App.ajax_queue_count= results._count;
            }});
            validate_request_fail(jqXHR);
            eval("false||"+properties.fail)(properties.data);
            callbacks.fail(properties.data);
        });

    }

    function validate_request_fail(jqXHR){
        if(jqXHR.status===422){
            if(typeof jqXHR.responseJSON === 'object')
                Alert_('Cola: '+_.pluck(jqXHR.responseJSON.errors, '0').join("\n"));
            else
                Alert_('Cola: Error de validació en campos');
            return false;
        }
        if(jqXHR.status===403){
            Alert_('Cola: Acceso denegado.');
            Login.logout();
            return false;
        }
        if(jqXHR.status===401){
            Alert_('Cola: Usuario sin autorización. Revise que la sesión no haya finalizado.');
            return false;
        }
    }

    var check_queue_from_element= function(element){
        element.loading();
        AjaxQueue.check_queue({
            empty:function(){
                Ajax_queueModel.countRaw("", {success:function(tx, results) {
                    App.ajax_queue_count= results._count;
                    element.unloading();
                }});

                Ajax_queueModel.countRaw("transmit_only_with_wifi= 'false' or transmit_only_with_wifi is null", {
                    success:function(tx, results) {
                        Alert_('Cola vacía. Peticiones pendientes por wifi '+results._count);
                    }
                });
            },
            fail: function(data){
                Ajax_queueModel.countRaw("", {success:function(tx, results) {
                    App.ajax_queue_count= results._count;
                    element.unloading();
                }});
                Alert_('Fallo transmisión de cola');
            },
            success: function(data){
                Ajax_queueModel.countRaw("", {success:function(tx, results) {
                    App.ajax_queue_count= results._count;
                }});
            }
        });
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            add                         : add,
            check_queue                 : check_queue,
            check_queue_from_element    : check_queue_from_element,
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
