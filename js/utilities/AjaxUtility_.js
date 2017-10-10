var AjaxUtility_= (function () {

    var processFaillRequest= function(jqXHR, textStatus, errorThrown){
        if(jqXHR.status==422)
            alert(_.pluck(jqXHR.responseJSON.errors, '0').join("\n"));
        else if(jqXHR.status==500)
            alert("Error de conexion con el servidor.\nRevise su conexion a internet.");
        else if(jqXHR.status==403){
            alert('Acceso denegado.');
            Login.logout();
        }else if(jqXHR.status==401)
            alert('Usuario sin autorización. Revise que la sesión no haya finalizado.');
        else
            alert("No se han podido cargar los datos. Intente mas tarde.**--"+ textStatus );
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            processFaillRequest    : processFaillRequest
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
