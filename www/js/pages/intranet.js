

//initializeIntranet();
/** Ready on mobiles **/
document.addEventListener("deviceready", onDeviceReadyIntranet, false);
function onDeviceReadyIntranet() {
    Check_hardware.diagnostic_in_intranet();
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

        var backgroundProcessTimer= undefined;
        var foreGroundProcessTimer= undefined;

        window.open = cordova.InAppBrowser.open;

        /** BACKGROUND PROCESS**/
        //Override the back button on Android to go to background instead of closing the app.
        cordova.plugins.backgroundMode.overrideBackButton();
        //active background process
        cordova.plugins.backgroundMode.enable();
        cordova.plugins.backgroundMode.disableWebViewOptimizations();

        cordova.plugins.backgroundMode.setDefaults({
            title: 'Courier App',
            text: 'Bienvenido',
            //icon: 'icon',  this will look for icon.png in platforms/android/res/drawable|mipmap
            color: '#b3b3ff', // hex format like 'F14F4D'
            resume: true,
            hidden: false,
            bigText: false
        });

        cordova.plugins.backgroundMode.on('activate', function() {
            alert('activate');
            ProcessBackground.reload_message_to_notification_bar(function(){setTimeout(function(){ProcessBackground.run();}, 300);});
            clearProcesses();
            backgroundProcessTimer= setInterval(function () {ProcessBackground.run(); ToastrUtility_.error('Primer ejecución');}, 5000);
        });

        cordova.plugins.backgroundMode.on('deactivate', function() {
            alert('deactivate');
            clearProcesses();
            foreGroundProcessTimer = setInterval(function(){
                ProcessForeground.run();
                ToastrUtility_.error('Deactive');
            }, 5000);
        });
        foreGroundProcessTimer = setInterval(function(){
            ToastrUtility_.error('INitial');
            ProcessForeground.run()
        }, 5000);


        function clearProcesses(){
            if(typeof(backgroundProcessTimer) !== 'undefined')clearInterval(backgroundProcessTimer);
            if(typeof(foreGroundProcessTimer) !== 'undefined')clearInterval(foreGroundProcessTimer);
        }
        /** CLOSE BACKGROUND PROCESS**/
    }

    $(document).bind("mobileinit", function(){
        $.mobile.allowCrossDomainPages = true;
    });

    initializePage();
}
//initializePage();