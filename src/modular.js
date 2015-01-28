// Bootstraps a modular Backbone.Marionette application
// leon.coto@mcsaatchi.com

define(function (require) {

    'use strict';

    var _ = require('underscore')
    , $ = require('jquery')
    , t = require('transform')
    , Err = require('modular/errors')
    , Marionette = require('backbone.marionette')

    , appSelector = t.selector('app')
    , moduleSelector = t.selector('module')
    , appRule = t.rule(appSelector, [moduleSelector])
    , moduleRule = t.rule(moduleSelector, [moduleSelector])
    , appTransform = t([appRule, moduleRule])

    //--------------------------------------------------------------------------
    //
    // API
    //
    //--------------------------------------------------------------------------

    /*
     * Dynamically generates a modular based Marionette.Applcation.
     * options.$el Required jQuery selection matching [data-app]
     * options.configKey Optional String the key for a global object storing
     *  configuration data for the modules.
     * callback Function a callback function with the following signature:
     *  function(error:Error, result:Object { app, options })
     */

    function Modular(options, callback) {

        var getData
        , modules
        , configure
        , definitions

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

        getData = globalConfig(options.configKey)
        configure = _.partial(configureNode, getData)

        modules = _
            .chain(nodePaths(appTransform(options.$el), []))
            .reduce(configure, [])
            .value()

        definitions = _
            .chain(modules)
            .pluck('definition')
            .uniq()
            .value()

        if(hasMissingDefinitions(definitions)){
            return callback(new Err.MissingDefinitionError())
        }

        loadDefinitions(definitions,
            function() {
                callback(null, application(modules))
            },
            function(error) {
                callback(new Err.FailedToLoadDefinitionError(error))
            }
        )
    }

    //----------------------------------
    //
    // Expose all errors
    //
    //----------------------------------

    _.each(Err, function(value, key) {
        Modular[key] = value
    })

    //--------------------------------------------------------------------------
    //
    // Utils
    //
    //--------------------------------------------------------------------------

    function application(modules) {
        var app = new Marionette.Application()
        , options = {}
        _.each(modules, function(module) {
            options[module.shortName] = module.data
            app.module(module.name, require(module.definition))
        })
        return {
            app: app,
            options: options
        }
    }

    function loadDefinitions(definitions, success, error) {
        var failed = false
        require(definitions, success, function(err) {
            // bail on first error
            if (failed) { return }
            error(err)
            failed = true
        })
    }

    function hasMissingDefinitions(definitions) {
        return _.some(definitions, function(definition) {
            return !definition
        })
    }

    function nodePaths(node, parent) {
        var current = parent.concat(node)
        return  _.reduce(node.children, function(names_, child) {
            return names_.concat(nodePaths(child, current))
        }, [ current ])
    }

    function name(node) {
        return $(node.el).attr('data-name') || _.uniqueId('unnamed-')
    }

    function definition(node) {
        return moduleSelector(node.el).value() || undefined
    }

    function nameFromPath(pathToNode) {
        return _.reduce(pathToNode, function (nameParts, node) {
            return nameParts.concat(name(node))
        }, []).join('.')
    }

    function configureNode(getData, configured, pathToNode) {
        var node
        if (pathToNode.length === 1) { return configured }
        node = _.last(pathToNode)
        node.name = nameFromPath(pathToNode.slice(1))
        node.data = getData(name(node))
        node.shortName = name(node)
        node.definition = definition(node)
        return configured.concat(node)
    }

    function globalConfig(configKey) {
        var cfg = window[configKey] || {}
        return function (key) {
            return cfg[key] || {}
        }
    }

    return Modular
});
