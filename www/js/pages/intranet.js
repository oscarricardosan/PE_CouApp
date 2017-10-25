var location_available= false;
var bluetooth_available= false;


function check_LocationAvailable(){
    cordova.plugins.diagnostic.isLocationAvailable(function(available){
        if(available){
            location_available= true;
            check_hardware();
        }else{
            location_available= false;
            alert('Para continuar debes activar tu GPS.');
            cordova.plugins.diagnostic.switchToLocationSettings();
            window.location.reload(true);
        }
    }, function(error){
        alert("The following error occurred: "+error);
    });
}

function check_BluetoothAvailable(){
    cordova.plugins.diagnostic.isBluetoothAvailable(function(available){
        if(available){
            bluetooth_available= true;
            check_hardware();
        }else{
            bluetooth_available= false;
            alert('Para continuar debes activar tu Bluetooth.');
            cordova.plugins.diagnostic.switchToBluetoothSettings();
            window.location.reload(true);
        }
    }, function(error){
        alert("The following error occurred: "+error);
    });
}

function check_hardware() {
    if(!location_available){
        check_LocationAvailable();
        return false;
    }
    if(!bluetooth_available){
        check_BluetoothAvailable();
        return false;
    }
    if(location_available && bluetooth_available)
        initializeIntranet();
    else
        window.location.reload();
}
//initializeIntranet();
/** Ready on mobiles **/
document.addEventListener("deviceready", onDeviceReadyIntranet, false);
function onDeviceReadyIntranet() {
    check_hardware();
}

function initializeIntranet(){
    $(document).ready(function(){
        Login.is_logged_in(function(success, user){
            if(!success){
                alert('Debes iniciar sesión para continuar');
                window.location.href= 'login.html';
            }
        });

        $('.logout').click(function(event){
            event.preventDefault();
            Login.logout();
        });
    });



    /** Ready on mobiles **/
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        window.open = cordova.InAppBrowser.open;

        /** BACKGROUND PROCESS**/
        var index_execution= 0;
        cordova.plugins.backgroundMode.enable();
        cordova.plugins.backgroundMode.disableWebViewOptimizations();
        cordova.plugins.backgroundMode.overrideBackButton();

        cordova.plugins.backgroundMode.setDefaults({
            title: 'Courier App',
            text: 'Me estoy ejecutando',
            //icon: 'icon',  this will look for icon.png in platforms/android/res/drawable|mipmap
            color: '#b3b3ff', // hex format like 'F14F4D'
            resume: true,
            hidden: false,
            bigText: false
        });

        cordova.plugins.backgroundMode.on('activate', function () {
            index_execution++;
            /***
             * @Notificaciones cada 100 segundos, cambio en la barra de mensaje
             */
            setInterval(function () {
                /*          if(index_execution % 100 == 0) {
                              navigator.notification.beep(2);
                              navigator.notification.vibrate([1500, 500, 1500]);
                          }
              */
                cordova.plugins.backgroundMode.configure({
                    text:
                    "ENtrada "+index_execution
                });
            }, 100);


        });

        /** CLOSE BACKGROUND PROCESS**/
    }

    $(document).bind("mobileinit", function(){
        $.mobile.allowCrossDomainPages = true;
    });

    initializePage();
}