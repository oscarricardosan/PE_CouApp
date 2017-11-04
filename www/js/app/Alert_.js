var Alert_= function (message) {
    if(cordova.plugins.backgroundMode.isActive())
        Notification.alert(message);
    else
        alert(message);
};