/*global mocha:false*/

require.config({
    baseUrl: '/src',
    paths: {
        underscore: '../bower_components/underscore/underscore',
        jquery: '../bower_components/jquery/dist/jquery',
        chai: '../bower_components/chai/chai',
        backbone: '../bower_components/backbone/backbone',
        'backbone.marionette': '../bower_components/backbone.marionette/lib/core/backbone.marionette',
        'backbone.babysitter': '../bower_components/backbone.babysitter/lib/backbone.babysitter',
        'backbone.wreqr': '../bower_components/backbone.wreqr/lib/backbone.wreqr',
        transform: '../bower_components/carnaby-transform/dist/transform'
    },
    modules: [{
        name: 'modular',
        exclude: [
            'backbone.marionette',
            'jquery',
            'underscore',
            'transform'
        ]
    }]
})

require([
    'chai',
    'jquery',
    'underscore',
    'backbone.marionette',
    'modular'
], function() {
    mocha.setup('bdd')
    require([
        'specs/modular'
    ], function() {
        mocha.run()
    })
})
