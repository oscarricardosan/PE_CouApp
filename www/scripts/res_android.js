#!/usr/bin/env node

//
// This hook copies various resource files from our version control system directories into the appropriate platform specific location
//


// configure all the files to copy.  Key of object is the source file, value is the destination location.  It's fine to put all platforms' icons and splash screen files here, even if we don't build for all platforms on each developer's box.
var filestocopy = [
// android
    { "images/warning.png": "platforms/android/res/drawable/warning.png" },
    { "images/warning.png": "platforms/android/res/drawable/warning_small.png" },
    { "images/warning.png": "platforms/android/res/drawable/warning_large.png" },
    { "images/warning.png": "platforms/android/res/drawable-hdpi/warning.png" },
    { "images/warning.png": "platforms/android/res/drawable-ldpi/warning.png" },
    { "images/warning.png": "platforms/android/res/drawable-mdpi/warning.png" },
    { "images/warning.png": "platforms/android/res/drawable-xhdpi/warning.png" },
    { "images/warning.png": "platforms/android/res/drawable-hdpi/warning.png" },
    { "images/warning.png": "platforms/android/res/drawable-hdpi/warning.png" },

    { "images/danger.png": "platforms/android/res/drawable/danger.png" },
    { "images/danger.png": "platforms/android/res/drawable/danger_small.png" },
    { "images/danger.png": "platforms/android/res/drawable/danger_large.png" },
    { "images/danger.png": "platforms/android/res/drawable-hdpi/danger.png" },
    { "images/danger.png": "platforms/android/res/drawable-ldpi/danger.png" },
    { "images/danger.png": "platforms/android/res/drawable-mdpi/danger.png" },
    { "images/danger.png": "platforms/android/res/drawable-xhdpi/danger.png" },
    { "images/danger.png": "platforms/android/res/drawable-hdpi/danger.png" },
    { "images/danger.png": "platforms/android/res/drawable-hdpi/danger.png" },

    { "images/success.png": "platforms/android/res/drawable/success.png" },
    { "images/success.png": "platforms/android/res/drawable/success_small.png" },
    { "images/success.png": "platforms/android/res/drawable/success_large.png" },
    { "images/success.png": "platforms/android/res/drawable-hdpi/success.png" },
    { "images/success.png": "platforms/android/res/drawable-ldpi/success.png" },
    { "images/success.png": "platforms/android/res/drawable-mdpi/success.png" },
    { "images/success.png": "platforms/android/res/drawable-xhdpi/success.png" },
    { "images/success.png": "platforms/android/res/drawable-hdpi/success.png" },
    { "images/success.png": "platforms/android/res/drawable-hdpi/success.png" },

    { "images/message.png": "platforms/android/res/drawable/message.png" },
    { "images/message.png": "platforms/android/res/drawable/message_small.png" },
    { "images/message.png": "platforms/android/res/drawable/message_large.png" },
    { "images/message.png": "platforms/android/res/drawable-hdpi/message.png" },
    { "images/message.png": "platforms/android/res/drawable-ldpi/message.png" },
    { "images/message.png": "platforms/android/res/drawable-mdpi/message.png" },
    { "images/message.png": "platforms/android/res/drawable-xhdpi/message.png" },
    { "images/message.png": "platforms/android/res/drawable-hdpi/message.png" },
    { "images/message.png": "platforms/android/res/drawable-hdpi/message.png" },
];

var fs = require('fs');
var path = require('path');

// no need to configure below
var rootdir = '';//process.argv[2];

filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        var srcfile = path.join(rootdir, key);
        var destfile = path.join(rootdir, val);
        console.log("copying "+srcfile+" to "+destfile);
        var destdir = path.dirname(destfile);
        if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
            fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
        }
    });
});
