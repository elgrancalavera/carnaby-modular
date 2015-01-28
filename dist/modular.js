//--------------------------------------------------------------------------
//
// carnaby.modular
// Copyright (c) 2015 M&C Saatchi
// Distributed under MIT license
//
//--------------------------------------------------------------------------

;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'underscore',
            'jquery',
            'transform',
            'backbone.marionette'
            ], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('underscore'),
            require('jquery'),
            require('transform'),
            require('backbone.marionette')
        );
    } else {
        root.transform = factory(
            root._,
            root.$,
            root.transform,
            root.Marionette
        );
    }
})(this, function(_, $, transform, Marionette) {
var underscore = _, jquery = $, backbonemarionette = Marionette;
// Errors
// leon.coto@mcsaatchi.com
var modular_errors, modular;
modular_errors = function () {
  'use strict';
  var Errors = {}, _ = underscore;
  //----------------------------------
  //
  // WrongArgumentsError
  //
  //----------------------------------
  Errors.WrongArgumentsError = function () {
    this.message = 'Wrong arguments. ' + 'Required argument `options` must be an  Object. ' + 'Required argument `callback` must be a Function.';
  };
  //----------------------------------
  //
  // InvalidRootElementError
  //
  //----------------------------------
  Errors.InvalidRootElementError = function (selector) {
    this.message = 'Invalid root element. ' + 'options.$el must match the following selector: "' + selector + '".';
  };
  //----------------------------------
  //
  // MissingElementError
  //
  //----------------------------------
  Errors.MissingElementError = function () {
    this.message = 'Required option `$el` is missing.';
  };
  //----------------------------------
  //
  // MissingConfigurationError
  //
  //----------------------------------
  Errors.MissingConfigurationError = function (key) {
    this.message = 'Global configuration object for key "' + key + '" not found.';
  };
  //----------------------------------
  //
  // MissingDefinitionError
  //
  //----------------------------------
  Errors.MissingDefinitionError = function () {
    this.message = 'Missing definition string for some modules.';
  };
  //----------------------------------
  //
  // FailedToLoadDefinitionError
  //
  //----------------------------------
  Errors.FailedToLoadDefinitionError = function (originalError) {
    this.message = 'Some definitions failed to load.\n' + originalError.message;
  };
  _.each(Errors, function (E) {
    E.prototype = new Error();
  });
  return Errors;
}();
modular = function (require) {
  'use strict';
  var _ = underscore, $ = jquery, t = transform, Err = modular_errors, Marionette = backbonemarionette, appSelector = t.selector('app'), moduleSelector = t.selector('module'), appRule = t.rule(appSelector, [moduleSelector]), moduleRule = t.rule(moduleSelector, [moduleSelector]), appTransform = t([
      appRule,
      moduleRule
    ]);
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
    var getData, modules, configure, definitions;
    if (!_.isObject(options) || !_.isFunction(callback)) {
      throw new Err.WrongArgumentsError();
    }
    if (!options.$el) {
      return callback(new Err.MissingElementError());
    }
    if (!appSelector(options.$el).isValid()) {
      return callback(new Err.InvalidRootElementError(appSelector.selector()));
    }
    if (_.isString(options.configKey) && _.isUndefined(window[options.configKey])) {
      return callback(new Err.MissingConfigurationError(options.configKey));
    }
    getData = globalConfig(options.configKey);
    configure = _.partial(configureNode, getData);
    modules = _.chain(nodePaths(appTransform(options.$el), [])).reduce(configure, []).value();
    definitions = _.chain(modules).pluck('definition').uniq().value();
    if (hasMissingDefinitions(definitions)) {
      return callback(new Err.MissingDefinitionError());
    }
    loadDefinitions(definitions, function () {
      callback(null, application(modules));
    }, function (error) {
      callback(new Err.FailedToLoadDefinitionError(error));
    });
  }
  //----------------------------------
  //
  // Expose all errors
  //
  //----------------------------------
  _.each(Err, function (value, key) {
    Modular[key] = value;
  });
  //--------------------------------------------------------------------------
  //
  // Utils
  //
  //--------------------------------------------------------------------------
  function application(modules) {
    var app = new Marionette.Application(), options = {};
    _.each(modules, function (module) {
      options[module.shortName] = module.data;
      app.module(module.name, require(module.definition));
    });
    return {
      app: app,
      options: options
    };
  }
  function loadDefinitions(definitions, success, error) {
    var failed = false;
  }
  function hasMissingDefinitions(definitions) {
    return _.some(definitions, function (definition) {
      return !definition;
    });
  }
  function nodePaths(node, parent) {
    var current = parent.concat(node);
    return _.reduce(node.children, function (names_, child) {
      return names_.concat(nodePaths(child, current));
    }, [current]);
  }
  function name(node) {
    return $(node.el).attr('data-name') || _.uniqueId('unnamed-');
  }
  function definition(node) {
    return moduleSelector(node.el).value() || undefined;
  }
  function nameFromPath(pathToNode) {
    return _.reduce(pathToNode, function (nameParts, node) {
      return nameParts.concat(name(node));
    }, []).join('.');
  }
  function configureNode(getData, configured, pathToNode) {
    var node;
    if (pathToNode.length === 1) {
      return configured;
    }
    node = _.last(pathToNode);
    node.name = nameFromPath(pathToNode.slice(1));
    node.data = getData(name(node));
    node.shortName = name(node);
    node.definition = definition(node);
    return configured.concat(node);
  }
  function globalConfig(configKey) {
    var cfg = window[configKey] || {};
    return function (key) {
      return cfg[key] || {};
    };
  }
  return Modular;
}({});
modular.VERSION = '0.0.0'
return modular;
});
/*
                                                  /
                                                .7
                                     \       , //
                                     |\.--._/|//
                                    /\ ) ) ).'/
                                   /(  \  // /
                                  /(   J`((_/ \
                                 / ) | _\     /
                                /|)  \  eJ    L
                               |  \ L \   L   L
                              /  \  J  `. J   L
                              |  )   L   \/   \
                             /  \    J   (\   /
           _....___         |  \      \   \```
    ,.._.-'        '''--...-||\     -. \   \
  .'.=.'                    `         `.\ [ Y
 /   /                                  \]  J
Y / Y                                    Y   L
| | |          \                         |   L
| | |           Y                        A  J
|   I           |                       /I\ /
|    \          I             \        ( |]/|
J     \         /._           /        -tI/ |
 L     )       /   /'-------'J           `'-:.
 J   .'      ,'  ,' ,     \   `'-.__          \
  \ T      ,'  ,'   )\    /|        ';'---7   /
   \|    ,'L  Y...-' / _.' /         \   /   /
    J   Y  |  J    .'-'   /         ,--.(   /
     L  |  J   L -'     .'         /  |    /\
     |  J.  L  J     .-;.-/       |    \ .' /
     J   L`-J   L____,.-'`        |  _.-'   |
      L  J   L  J                  ``  J    |
      J   L  |   L                     J    |
       L  J  L    \                    L    \
       |   L  ) _.'\                    ) _.'\
       L    \('`    \                  ('`    \
        ) _.'\`-....'                   `-....'
       ('`    \
        `-.___/
*/
