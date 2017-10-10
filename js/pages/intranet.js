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
    cordova.plugins.backgroundMode.setEnabled(true);
    cordova.plugins.backgroundMode.overrideBackButton();

    cordova.plugins.backgroundMode.setDefaults({
        title: 'Courier App',
        text: 'Me estoy ejecutando',
        //icon: 'icon',  this will look for icon.png in platforms/android/res/drawable|mipmap
        color: 'F14F4D', // hex format like 'F14F4D'
        resume: Boolean,
        hidden: Boolean,
        bigText: Boolean
    })
}

$(document).bind("mobileinit", function(){
    $.mobile.allowCrossDomainPages = true;
});