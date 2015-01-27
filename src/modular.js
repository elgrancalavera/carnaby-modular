// Bootstraps a modular Backbone.Marionette application
// leon.coto@mcsaatchi.com
// jshint unused: false
define(function (require) {

    'use strict';

    var t = require('transform')
    ,   _ = require('underscore')

    ,   appSelector = t.selector('app')
    ,   moduleSelector = t.selector('module')

    ,   appRule = t.rule(appSelector, [moduleSelector])
    ,   moduleRule = t.rule(moduleSelector, [moduleSelector])

    ,   appTransform = t([appRule, moduleRule])

    function undefinedRoot() {
        return new Error('Required option `$el` is missing.')
    }

    function wrongArguments() {
        return new Error('Wrong arguments. Required argument `options` must be an  Object. Required argument `callback` must be a Function.')
    }

    function invalidElement() {
        return new Error('Invalid root element: options.$el must match the following selector: "' + appSelector.selector() + '".')
    }

    function missingConfigurationObject(key) {
        return new Error('Global configuration object for key "' + key + '" not found.')
    }

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
            throw wrongArguments()
        }

        if (!options.$el) {
            return callback(undefinedRoot())
        }

        if(!appSelector(options.$el).isValid()) {
            callback(invalidElement())
        }

        if (_.isString(options.configKey) && _.isUndefined(window[options.configKey])) {
            callback(missingConfigurationObject(options.configKey))
        }

    }

    return Modular
});
