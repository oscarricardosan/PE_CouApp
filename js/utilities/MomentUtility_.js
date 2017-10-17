var MomentUtility_= (function () {

    var numericDate= function (){
        return  moment().year()+''+moment().month()+''+moment().date();
    };

    var current_date= function (){
        var real_month= moment().month()+1;
        var month= real_month<10? '0'+real_month:real_month;
        var date= moment().date()<10? '0'+moment().date():moment().date();
        return  moment().year()+'-'+month+'-'+date;
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            numericDate           : numericDate,
            current_date          : current_date,
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
