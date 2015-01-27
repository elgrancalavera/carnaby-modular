// Bootstraps a modular Backbone.Marionette application
// leon.coto@mcsaatchi.com
// jshint unused: false
define(function (require) {

    'use strict';

    var t = require('transform')
    ,   Err = require('modular/errors')
    ,   _ = require('underscore')

    ,   appSelector = t.selector('app')
    ,   moduleSelector = t.selector('module')

    ,   appRule = t.rule(appSelector, [moduleSelector])
    ,   moduleRule = t.rule(moduleSelector, [moduleSelector])

    ,   appTransform = t([appRule, moduleRule])

    /*
     * Dynamically generates a modular based Marionette.Applcation.
     * options.$el Required jQuery selection matching [data-app]
     * options.configKey Optional String the key for a global object storing
     *  configuration data for the modules.
     * callback Function a callback function with the following signature:
     *  function(error:Error, app:Marionette.Application)
     */
    function Modular(options, callback) {

        if (!_.isObject(options) || !_.isFunction(callback)) {
            throw new Err.WrongArgumentsError()
        }

        if (!options.$el) {
            return callback(new Err.MissingElementError())
        }

        if(!appSelector(options.$el).isValid()) {
            return callback(new Err.InvalidRootElementError(appSelector.selector()))
        }

        if (_.isString(options.configKey) && _.isUndefined(window[options.configKey])) {
            return callback(new Err.MissingConfigurationError(options.configKey))
        }

    }

    //----------------------------------
    //
    // Expose all errors
    //
    //----------------------------------

    _.each(Err, function(value, key) {
        Modular[key] = value
    })

    return Modular
});
