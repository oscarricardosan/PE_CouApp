var AjaxUtility_= (function () {

    var processFaillRequest= function(jqXHR, textStatus, errorThrown){
        if(jqXHR.status===422)
            alert(_.pluck(jqXHR.responseJSON.errors, '0').join("\n"));
        else if(jqXHR.status===500)
            alert("Error de conexion con el servidor.\nRevise su conexion a internet.");
        else if(jqXHR.status===403){
            alert('Acceso denegado. '+ jqXHR.responseJSON.message);
            Login.logout();
        }else if(jqXHR.status===401)
            alert('Usuario sin autorización. Revise que la sesión no haya finalizado.');
        else
            alert("No se han podido cargar los datos. Intente mas tarde.**--"+ textStatus );
    };

    var processFaillRequestWithLocalNotification= function(jqXHR, textStatus, errorThrown){
        if(jqXHR.status===422)
            Notification.alert(_.pluck(jqXHR.responseJSON.errors, '0').join("\n"));
        else if(jqXHR.status===500)
            Notification.alert("Error de conexion con el servidor.\nRevise su conexion a internet.");
        else if(jqXHR.status===403){
            Notification.alert('Acceso denegado. '+ jqXHR.responseJSON.message);
            Login.logout();
        }else if(jqXHR.status===401)
            Notification.alert('Usuario sin autorización. Revise que la sesión no haya finalizado.');
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            processFaillRequest                       : processFaillRequest,
            processFaillRequestWithLocalNotification  : processFaillRequestWithLocalNotification
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
