require.config({
    paths: {
        underscore: '../bower_components/underscore/underscore',
        jquery: '../bower_components/jquery/dist/jquery'
    },
    modules: [{
        name: 'modular',
        exclude: [
            'backbone.marionette',
            'jquery',
            'underscore'
        ]
    }]
})
