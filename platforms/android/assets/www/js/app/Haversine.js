var Haversine= (function () {
    var atan2 = Math.atan2;
    var cos = Math.cos;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    var PI = Math.PI;

    // (mean) radius of Earth (meters)
    var R = 6378137

    function squared (x) { return x * x }
    function toRad (x) { return x * PI / 180.0 }

    var distance= function (a, b) {
        var aLat = a.latitude || a.lat;
        var bLat = b.latitude || b.lat;
        var aLng = a.longitude || a.lng || a.lon;
        var bLng = b.longitude || b.lng || b.lon;

        var dLat = toRad(bLat - aLat);
        var dLon = toRad(bLng - aLng);

        var f = squared(sin(dLat / 2.0)) + cos(toRad(aLat)) * cos(toRad(bLat)) * squared(sin(dLon / 2.0));
        var c = 2 * atan2(sqrt(f), sqrt(1 - f));

        return R * c
    };

    var distance_in_text= function(point_a, point_b){
        var error= undefined;
        if(point_a === undefined || point_a === null)error= 'Posición actual no definida';
        else if(point_b === undefined || point_b === null)error= 'Posición de objetivo no definida';
        else if(point_a.longitude === undefined)error= 'Sin información de longitud';
        else if(point_a.latitude === undefined)error= 'Sin información de latitud';
        else if(point_b.longitude === undefined)error= 'Sin información de longitud en objetivo';
        else if(point_b.latitude === undefined)error= 'Sin información de latitud en objetivo';
        if(error !== undefined){
            return {
                distance: undefined,
                success: false,
                message: error,
            }
        }
        var distance= Haversine.distance(
            {latitude: point_a.latitude, longitude: point_a.longitude},
            {latitude: point_b.latitude, longitude: point_b.longitude}
        );
        if(distance>1000)
            return {
                distance_in_mts: distance,
                success: true,
                message: 'A '+accounting.formatNumber(distance/1000, 2, '.', ',')+' km',
            };
        else
            return {
                distance_in_mts: distance,
                success: true,
                message: 'A '+accounting.formatNumber(distance, 2, '.', ',')+' mts',
            };
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            distance           : distance,
            distance_in_text   : distance_in_text
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
