cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "call-number.CallNumber",
    "file": "plugins/call-number/www/CallNumber.js",
    "pluginId": "call-number",
    "clobbers": [
      "call"
    ]
  },
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
    "id": "cordova-plugin-navis-background-geolocation.backgroundGeoLocation",
    "file": "plugins/cordova-plugin-navis-background-geolocation/www/backgroundGeoLocation.js",
    "pluginId": "cordova-plugin-navis-background-geolocation",
    "clobbers": [
      "backgroundGeoLocation"
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
    "id": "de.appplant.cordova.plugin.local-notification.LocalNotification",
    "file": "plugins/de.appplant.cordova.plugin.local-notification/www/local-notification.js",
    "pluginId": "de.appplant.cordova.plugin.local-notification",
    "clobbers": [
      "cordova.plugins.notification.local",
      "plugin.notification.local"
    ]
  },
  {
    "id": "de.appplant.cordova.plugin.local-notification.LocalNotification.Core",
    "file": "plugins/de.appplant.cordova.plugin.local-notification/www/local-notification-core.js",
    "pluginId": "de.appplant.cordova.plugin.local-notification",
    "clobbers": [
      "cordova.plugins.notification.local.core",
      "plugin.notification.local.core"
    ]
  },
  {
    "id": "de.appplant.cordova.plugin.local-notification.LocalNotification.Util",
    "file": "plugins/de.appplant.cordova.plugin.local-notification/www/local-notification-util.js",
    "pluginId": "de.appplant.cordova.plugin.local-notification",
    "merges": [
      "cordova.plugins.notification.local.core",
      "plugin.notification.local.core"
    ]
  },
  {
    "id": "cordova-plugin-network-information.network",
    "file": "plugins/cordova-plugin-network-information/www/network.js",
    "pluginId": "cordova-plugin-network-information",
    "clobbers": [
      "navigator.connection",
      "navigator.network.connection"
    ]
  },
  {
    "id": "cordova-plugin-network-information.Connection",
    "file": "plugins/cordova-plugin-network-information/www/Connection.js",
    "pluginId": "cordova-plugin-network-information",
    "clobbers": [
      "Connection"
    ]
  },
  {
    "id": "cordova-sqlite-storage.SQLitePlugin",
    "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
    "pluginId": "cordova-sqlite-storage",
    "clobbers": [
      "SQLitePlugin"
    ]
  },
  {
    "id": "cordova-sqlite-evcore-extbuild-free.SQLitePlugin",
    "file": "plugins/cordova-sqlite-evcore-extbuild-free/www/SQLitePlugin.js",
    "pluginId": "cordova-sqlite-evcore-extbuild-free",
    "clobbers": [
      "SQLitePlugin"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "call-number": "1.0.4",
  "cordova-plugin-android-permissions": "1.0.0",
  "cordova-plugin-app-event": "1.2.1",
  "cordova-plugin-device": "1.1.6",
  "cordova-plugin-background-mode": "0.7.2",
  "cordova-plugin-camera": "2.4.1",
  "cordova-plugin-cszbar": "1.3.2",
  "cordova-plugin-datecs-printer": "0.7.4",
  "cordova-plugin-dialogs": "1.3.3",
  "cordova-plugin-geolocation": "2.4.3",
  "cordova-plugin-inappbrowser": "1.7.1",
  "cordova-plugin-navis-background-geolocation": "1.0.2",
  "cordova-plugin-vibration": "2.1.5",
  "cordova-plugin-whitelist": "1.3.2",
  "cordova.plugins.diagnostic": "3.7.1",
  "de.appplant.cordova.plugin.local-notification": "0.8.5",
  "cordova-plugin-network-information": "1.3.3",
  "cordova-sqlite-storage": "2.1.2",
  "cordova-sqlite-evcore-extbuild-free": "0.9.0"
};
// BOTTOM OF METADATA
});