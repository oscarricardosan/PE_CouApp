var MomentUtility_= (function () {

    var numericDate= function (){
        return  moment().year()+''+moment().month()+''+moment().date();
    };

    var current_date= function (){
        var month= moment().month()<10? '0'+moment().month():moment().month();
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
