cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-android-permissions.Permissions",
        "file": "plugins/cordova-plugin-android-permissions/www/permissions.js",
        "pluginId": "cordova-plugin-android-permissions",
        "clobbers": [
            "cordova.plugins.permissions"
        ]
    },
    {
        "id": "cordova-plugin-device.device",
        "file": "plugins/cordova-plugin-device/www/device.js",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "id": "cordova-plugin-background-mode.BackgroundMode",
        "file": "plugins/cordova-plugin-background-mode/www/background-mode.js",
        "pluginId": "cordova-plugin-background-mode",
        "clobbers": [
            "cordova.plugins.backgroundMode",
            "plugin.backgroundMode"
        ]
    },
    {
        "id": "cordova-plugin-camera.Camera",
        "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "id": "cordova-plugin-camera.CameraPopoverOptions",
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "id": "cordova-plugin-camera.camera",
        "file": "plugins/cordova-plugin-camera/www/Camera.js",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "id": "cordova-plugin-camera.CameraPopoverHandle",
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverHandle.js",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "CameraPopoverHandle"
        ]
    },
    {
        "id": "cordova-plugin-cszbar.zBar",
        "file": "plugins/cordova-plugin-cszbar/www/zbar.js",
        "pluginId": "cordova-plugin-cszbar",
        "clobbers": [
            "cloudSky.zBar"
        ]
    },
    {
        "id": "cordova-plugin-datecs-printer.DatecsPrinter",
        "file": "plugins/cordova-plugin-datecs-printer/www/printer.js",
        "pluginId": "cordova-plugin-datecs-printer",
        "clobbers": [
            "DatecsPrinter"
        ]
    },
    {
        "id": "cordova-plugin-dialogs.notification",
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "id": "cordova-plugin-dialogs.notification_android",
        "file": "plugins/cordova-plugin-dialogs/www/android/notification.js",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "id": "cordova-plugin-geolocation.geolocation",
        "file": "plugins/cordova-plugin-geolocation/www/android/geolocation.js",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "navigator.geolocation"
        ]
    },
    {
        "id": "cordova-plugin-geolocation.PositionError",
        "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
        "pluginId": "cordova-plugin-geolocation",
        "runs": true
    },
    {
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "id": "cordova-plugin-vibration.notification",
        "file": "plugins/cordova-plugin-vibration/www/vibration.js",
        "pluginId": "cordova-plugin-vibration",
        "merges": [
            "navigator.notification",
            "navigator"
        ]
    },
    {
        "id": "cordova.plugins.diagnostic.Diagnostic",
        "file": "plugins/cordova.plugins.diagnostic/www/android/diagnostic.js",
        "pluginId": "cordova.plugins.diagnostic",
        "clobbers": [
            "cordova.plugins.diagnostic"
        ]
    },
    {
        "id": "cordova-plugin-navis-background-geolocation.backgroundGeoLocation",
        "file": "plugins/cordova-plugin-navis-background-geolocation/www/backgroundGeoLocation.js",
        "pluginId": "cordova-plugin-navis-background-geolocation",
        "clobbers": [
            "backgroundGeoLocation"
        ]
    },
    {
        "id": "cordova-plugin-badge.Badge",
        "file": "plugins/cordova-plugin-badge/www/badge.js",
        "pluginId": "cordova-plugin-badge",
        "clobbers": [
            "cordova.plugins.notification.badge"
        ]
    },
    {
        "id": "cordova-plugin-local-notifications.LocalNotification",
        "file": "plugins/cordova-plugin-local-notifications/www/local-notification.js",
        "pluginId": "cordova-plugin-local-notifications",
        "clobbers": [
            "cordova.plugins.notification.local"
        ]
    },
    {
        "id": "cordova-plugin-local-notifications.LocalNotification.Core",
        "file": "plugins/cordova-plugin-local-notifications/www/local-notification-core.js",
        "pluginId": "cordova-plugin-local-notifications",
        "clobbers": [
            "cordova.plugins.notification.local.core",
            "plugin.notification.local.core"
        ]
    },
    {
        "id": "cordova-plugin-local-notifications.LocalNotification.Util",
        "file": "plugins/cordova-plugin-local-notifications/www/local-notification-util.js",
        "pluginId": "cordova-plugin-local-notifications",
        "merges": [
            "cordova.plugins.notification.local.core",
            "plugin.notification.local.core"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-android-permissions": "1.0.0",
    "cordova-plugin-device": "1.1.6",
    "cordova-plugin-background-mode": "0.7.2",
    "cordova-plugin-compat": "1.2.0",
    "cordova-plugin-camera": "2.4.1",
    "cordova-plugin-cszbar": "1.3.2",
    "cordova-plugin-datecs-printer": "0.7.4",
    "cordova-plugin-dialogs": "1.3.3",
    "cordova-plugin-geolocation": "2.4.3",
    "cordova-plugin-inappbrowser": "1.7.1",
    "cordova-plugin-vibration": "2.1.5",
    "cordova-plugin-whitelist": "1.3.2",
    "cordova.plugins.diagnostic": "3.7.1",
    "cordova-plugin-navis-background-geolocation": "1.0.2",
    "cordova-plugin-badge": "0.8.5",
    "cordova-plugin-local-notifications": "0.9.0-beta.0"
};
// BOTTOM OF METADATA
});