// Errors
// leon.coto@mcsaatchi.com
define(function () {
    'use strict';

    var Errors = {}

    Errors.WrongArgumentsError = function() {
        this.message = 'Wrong arguments. ' +
        'Required argument `options` must be an  Object. ' +
        'Required argument `callback` must be a Function.'
    }
    Errors.WrongArgumentsError.prototype = new Error()

    Errors.InvalidRootElementError = function(selector) {
        this.message = 'Invalid root element. ' +
        'options.$el must match the following selector: "' + selector + '".'
    }
    Errors.InvalidRootElementError.prototype = new Error()

    Errors.MissingElementError = function() {
        this.message = 'Required option `$el` is missing.'
    }
    Errors.MissingElementError.prototype = new Error()

    Errors.MissingConfigurationError = function(key) {
        this.message = 'Global configuration object for key "' + key + '" not found.'
    }
    Errors.MissingConfigurationError.prototype = new Error()


    return Errors
});
