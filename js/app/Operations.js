var Operations= (function () {

    var get_data= function (date){
        if(date === undefined)
            date= MomentUtility_.current_date();
        var request = $.ajax({
            url: Settings.route_api_pasar("operations_data"),
            type: 'post',
            dataType: "json",
            data: {
                date: date,
                user: SecurityUtility_.get_auth()
            }
        });
        request.done(function(response){

            //callback.success(response);
        });
        request.fail(function(jqXHR, textStatus) {
            //callback.failure(jqXHR, textStatus);
            AjaxUtility_.processFaillRequest(jqXHR, textStatus);
        });
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            get_data       : get_data
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();

