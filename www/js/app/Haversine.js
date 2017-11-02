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

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            distance           : distance
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
