// Errors
// leon.coto@mcsaatchi.com
define(function () {
    'use strict';

    var Errors = {}
    , _ = require('underscore')

    //----------------------------------
    //
    // WrongArgumentsError
    //
    //----------------------------------

    Errors.WrongArgumentsError = function() {
        this.message = 'Wrong arguments. ' +
        'Required argument `options` must be an  Object. ' +
        'Required argument `callback` must be a Function.'
    }

    //----------------------------------
    //
    // InvalidRootElementError
    //
    //----------------------------------

    Errors.InvalidRootElementError = function(selector) {
        this.message = 'Invalid root element. ' +
        'options.$el must match the following selector: "' + selector + '".'
    }

    //----------------------------------
    //
    // MissingElementError
    //
    //----------------------------------

    Errors.MissingElementError = function() {
        this.message = 'Required option `$el` is missing.'
    }

    //----------------------------------
    //
    // MissingConfigurationError
    //
    //----------------------------------

    Errors.MissingConfigurationError = function(key) {
        this.message = 'Global configuration object for key "' + key + '" not found.'
    }

    //----------------------------------
    //
    // MissingDefinitionError
    //
    //----------------------------------

    Errors.MissingDefinitionError = function() {
        this.message = 'Missing definition string for some modules.'
    }

    //----------------------------------
    //
    // FailedToLoadDefinitionError
    //
    //----------------------------------

    Errors.FailedToLoadDefinitionError = function(originalError) {
        this.message = 'Some definitions failed to load.\n' + originalError.message
    }

    _.each(Errors, function(E) { E.prototype = new Error() })
    return Errors
});
