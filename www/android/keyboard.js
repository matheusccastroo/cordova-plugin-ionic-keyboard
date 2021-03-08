var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    channel = require('cordova/channel');

var Keyboard = function () {};

const KeyboardPlugin = {
    getHeight: () => (arg, success, error) => cordova.exec(success, error, "CDVIonicKeyboad", "getHeight", [arg])
}

Keyboard.fireOnShow = function (height) {
    Keyboard.isVisible = true;
    cordova.fireWindowEvent('keyboardDidShow', {
        'keyboardHeight': height
    });

    // To support the keyboardAttach directive listening events
    // inside Ionic's main bundle
    cordova.fireWindowEvent('native.keyboardshow', {
        'keyboardHeight': height
    });
};

Keyboard.fireOnHide = function () {
    Keyboard.isVisible = false;
    cordova.fireWindowEvent('keyboardDidHide');

    // To support the keyboardAttach directive listening events
    // inside Ionic's main bundle
    cordova.fireWindowEvent('native.keyboardhide');
};

Keyboard.fireOnHiding = function () {
    cordova.fireWindowEvent('keyboardWillHide');
};

Keyboard.fireOnShowing = function (height) {
    cordova.fireWindowEvent('keyboardWillShow', {
        'keyboardHeight': height
    });
};

Keyboard.hide = function () {
    exec(null, null, "CDVIonicKeyboard", "hide", []);
};

Keyboard.show = function () {
    exec(null, null, "CDVIonicKeyboard", "show", []);
};

channel.onCordovaReady.subscribe(function () {
    exec(success, null, 'CDVIonicKeyboard', 'init', []);

    function success(msg) {
        var action = msg.charAt(0);
        if (action === 'S') {
            var keyboardHeight = parseInt(msg.substr(1));
            Keyboard.fireOnShowing(keyboardHeight);
            Keyboard.fireOnShow(keyboardHeight);

        } else if (action === 'H') {
            Keyboard.fireOnHiding();
            Keyboard.fireOnHide();
        }
    }
});


Keyboard.isVisible = false;

module.exports = KeyboardPlugin;
