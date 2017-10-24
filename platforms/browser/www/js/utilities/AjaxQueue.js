var AjaxQueue= (function () {

    var add= function(properties){
        properties= PolishedUtility_.ajaxQueueProperties(properties);
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

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            add            : add
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
