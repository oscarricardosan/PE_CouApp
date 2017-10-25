var Check_hardware= (function () {

    var location_available= false;
    var bluetooth_available= false;


    var locationAvailable= function(){
        cordova.plugins.diagnostic.isLocationAvailable(function(available){
            if(available){
                location_available= true;
                diagnostic_in_intranet();
            }else{
                location_available= false;
                alert('Para continuar debes activar tu GPS.');
                cordova.plugins.diagnostic.switchToLocationSettings();
                window.location.reload(true);
            }
        }, function(error){
            alert("The following error occurred: "+error);
        });
    };

    var bluetoothAvailable= function(){
        cordova.plugins.diagnostic.isBluetoothAvailable(function(available){
            if(available){
                bluetooth_available= true;
                diagnostic_in_intranet();
            }else{
                bluetooth_available= false;
                alert('Para continuar debes activar tu Bluetooth.');
                cordova.plugins.diagnostic.switchToBluetoothSettings();
                window.location.reload(true);
            }
        }, function(error){
            alert("The following error occurred: "+error);
        });
    };

    var diagnostic_in_intranet= function() {
        if(!location_available){
            locationAvailable();
            return false;
        }
        if(!bluetooth_available){
            bluetoothAvailable();
            return false;
        }
        if(location_available && bluetooth_available)
            initializeIntranet();
        else
            window.location.reload();
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            check_LocationAvailable     : check_LocationAvailable,
            check_BluetoothAvailable    : check_BluetoothAvailable,
            diagnostic_in_intranet      : diagnostic_in_intranet
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
