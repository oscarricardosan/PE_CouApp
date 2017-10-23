var ToastrUtility_= (function () {

    /**
     *
     * @param type = [success, info, Warning, error]
     * @param msg
     * @param title
     */
    function configToastr() {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    }

    var success= function(message, title)
    {
        configToastr();
        title= title==undefined?'Exitoso':title;
        toastr['success'](message, title);
    }

    var info= function(message, title)
    {
        configToastr();
        title= title==undefined?'Información':title;
        toastr['info'](message, title);
    }

    var warning= function(message, title)
    {
        configToastr();
        title= title==undefined?'Cuidado':title;
        toastr['warning'](message, title);
    }

    var error= function(message, title)
    {
        configToastr();
        title= title==undefined?'Error':title;
        toastr['error'](message, title);
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            success     : success,
            info        : info,
            warning     : warning,
            error       : error
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();