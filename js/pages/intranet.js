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

            // Get a reference to the plugin.
            var bgGeo = window.BackgroundGeolocation;

            //This callback will be executed every time a geolocation is recorded in the background.
            var callbackFn = function(location) {
                var coords = location.coords;
                var lat    = coords.latitude;
                var lng    = coords.longitude;
                console.log('- Location: ', JSON.stringify(location));
                cordova.plugins.backgroundMode.configure({
                        text: '- Location: '+ JSON.stringify(location)
                    }
                );
            };

            // This callback will be executed if a location-error occurs.  Eg: this will be called if user disables location-services.
            var failureFn = function(errorCode) {
                console.warn('- BackgroundGeoLocation error: ', errorCode);
            }

            // Listen to location events & errors.
            bgGeo.on('location', callbackFn, failureFn);
            // Fired whenever state changes from moving->stationary or vice-versa.
            bgGeo.on('motionchange', function(isMoving) {
                console.log('- onMotionChange: ', isMoving);
            });
            // Fired whenever a geofence transition occurs.
            bgGeo.on('geofence', function(geofence) {
                console.log('- onGeofence: ', geofence.identifier, geofence.location);
            });
            // Fired whenever an HTTP response is received from your server.
            bgGeo.on('http', function(response) {
                console.log('http success: ', response.responseText);
            }, function(response) {
                console.log('http failure: ', response.status);
            });

            // BackgroundGeoLocation is highly configurable.
            bgGeo.configure({
                // Geolocation config
                desiredAccuracy: 0,
                distanceFilter: 10,
                stationaryRadius: 25,
                // Activity Recognition config
                activityRecognitionInterval: 10000,
                stopTimeout: 5,
                // Application config
                debug: true,  // <-- Debug sounds & notifications.
                stopOnTerminate: false,
                startOnBoot: true,
                // HTTP / SQLite config
                url: "http://your.server.com/locations",
                method: "POST",
                autoSync: true,
                maxDaysToPersist: 3,
                headers: {  // <-- Optional HTTP headers
                    "X-FOO": "bar"
                },
                params: {   // <-- Optional HTTP params
                    "auth_token": "maybe_your_server_authenticates_via_token_YES?"
                }
            }, function(state) {
                // This callback is executed when the plugin is ready to use.
                console.log("BackgroundGeolocation ready: ", state);
                if (!state.enabled) {
                    bgGeo.start();
                }
            });

            // The plugin is typically toggled with some button on your UI.
            function onToggleEnabled(value) {
                if (value) {
                    bgGeo.start();
                } else {
                    bgGeo.stop();
                }
            }

        /***
         * @Notificaciones cada 100 segundos, cambio en la barra de mensaje
         */
        var index_execution=0;
        setInterval(function () {
            index_execution++;
            if(index_execution % 100 == 0) {
                navigator.notification.beep(2);
                navigator.notification.vibrate([1500, 500, 1500]);
            }

            cordova.plugins.backgroundMode.configure({
                text:
                    "Recolecciones pendientes 5 de  "+index_execution+
                    "\nEntregas pendientes 1 de  "+index_execution
                }
            );
        }, 5000);


    });

    /** CLOSE BACKGROUND PROCESS**/
}

$(document).bind("mobileinit", function(){
    $.mobile.allowCrossDomainPages = true;
});