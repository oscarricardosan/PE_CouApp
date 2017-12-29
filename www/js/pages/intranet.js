

function initializeApp(){
    Check_hardware.diagnostic_in_intranet();
}

function initializeIntranet(){
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

    (function setup_processes(){
        var backgroundProcessTimer= undefined;
        var foreGroundProcessTimer= undefined;

        window.open = cordova.InAppBrowser.open;

        /** BACKGROUND PROCESS**/
        //Override the back button on Android to go to background instead of closing the app.
        //cordova.plugins.backgroundMode.overrideBackButton();
        //active background process
        cordova.plugins.backgroundMode.enable();
        cordova.plugins.backgroundMode.disableWebViewOptimizations();


        initializeBackgroundProcess();
        initializeGpsBackground();
        initializeActionsInLocalNotifications();

        cordova.plugins.backgroundMode.on('activate', function() {
            try{
                Gps.clear_watches();
                backgroundGeoLocation.start();
                //Mostrar el estado inicial de la barra
                ProcessBackground.reload_message_to_notification_bar(function(){setTimeout(function(){ProcessBackground.run();}, 300);});
                //Limpiar timers
                clearProcesses();
                //Ejecuta proceso de fondo cada 5 segundos
                backgroundProcessTimer= setInterval(function () {ProcessBackground.run();}, 5000);
            }catch(e){
                Notification.event_server_pickup_message('Background 1 '+e.message);
            }
        });

        cordova.plugins.backgroundMode.on('deactivate', function() {
            try{
                backgroundGeoLocation.stop();
                Gps.start_tracking();
                //Limpiar timers
                clearProcesses();
                //Ejecuta proceso de frente cada 5 segundos
                foreGroundProcessTimer = setInterval(function(){
                    ProcessForeground.run();
                }, 5000);
            }catch(e){
                Notification.event_server_pickup_message('Background 2 '+e.message);
            }
        });
        foreGroundProcessTimer = setInterval(function(){ProcessForeground.run()}, 5000);
        Gps.start_tracking();


        function clearProcesses(){
            if(typeof(backgroundProcessTimer) !== 'undefined')clearInterval(backgroundProcessTimer);
            if(typeof(foreGroundProcessTimer) !== 'undefined')clearInterval(foreGroundProcessTimer);
        }


        function initializeGpsBackground(){
            //Configuracion GPS Background
            backgroundGeoLocation.configure(Gps.store_position_from_background, function(error){
                ProcessBackground.set_main_message_notification_bar('Error '+error.message);
            }, {
                desiredAccuracy: 10,
                stationaryRadius: 20,
                distanceFilter: 30,
                debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
                stopOnTerminate: true, // <-- enable this to clear background location settings when the app terminates
                // notificationIconColor: '#4CAF50',
                notificationTitle: 'CourierApp toca para abrir',
                notificationText: '. . .',
                //  notificationIcon: '/images/danger.png'
            });
        }

        function initializeBackgroundProcess(){
            //Configuracion status bar
            cordova.plugins.backgroundMode.setDefaults({
                title: 'CourierApp',
                text: 'Bienvenido',
                //icon: '/images/danger.png', // this will look for icon.png in platforms/android/res/drawable|mipmap
                //color: '#ff0000', // hex format like 'F14F4D'
                resume: false,
                hidden: false,
                bigText: false
            });

        }

        function initializeActionsInLocalNotifications() {
            cordova.plugins.notification.local.on("click", function (notification) {
                var data = notification.data;
                if (typeof notification.data === 'string') data = JSON.parse(data);
                data= (data===undefined)?{}:data;
                switch (data.action) {
                    case "show_delivery":
                        var delivery = data.delivery;
                        window.location = 'index.html?filter_date=' + delivery.date + '&search=' + delivery.number+ '&tab=tab_deliveries';
                        break;
                    case "show_pickup":
                        var pickup = data.pickup;
                        window.location = 'index.html?filter_date=' + pickup.date + '&search=' + pickup.number + '&tab=tab_pickups';
                        break;
                }
            });
        }

        /** CLOSE BACKGROUND PROCESS**/

        /** INITIALIZE UTILITIES **/
        SecurityUtility_.load_user_data();
    })();
    $(document).bind("mobileinit", function(){
        $.mobile.allowCrossDomainPages = true;
    });

    initializePage();
}
//initializePage();