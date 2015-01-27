// Tests for errors
// leon.coto@mcsaatchi.com

// jshint unused:false
// jshint newcap: false
define(function (require) {
    'use strict';

    var expect = require('chai').expect
    var $ = require('jquery')
    var Modular = require('modular')

    describe('Errors', function() {

        describe(
        'Invalid Selections',
        function() {

            it(
            'Should throw an error when called with the wrong arguments.',
            function() {
                expect(Modular).to.throw(Modular.WrongArgumentsError)
            })

            it(
            'Should return an error when the root selection is not defined.',
            function(done) {
                Modular({}, function(err) {
                    expect(err).to.be.instanceof(Modular.MissingElementError)
                    done()
                })
            })

            it(
            'Should return an error when the root selection is not valid.',
            function(done) {
                Modular({$el: $('nothing')}, function(err) {
                    expect(err).to.be.instanceof(Modular.InvalidRootElementError)
                    done()
                })
            })

        })

        describe(
        'Global Configuration',
        function() {

            it(
            'Should return an error when a global configuration key is given ' +
            'and a global configuration object is not found.',
            function(done) {
                Modular({
                    $el: $('#broken-app'),
                    configKey: 'nothing'
                }, function(err) {
                    expect(err).to.be.instanceof(Modular.MissingConfigurationError)
                    done()
                })
            })

        })

        describe(
        'Missing Definitions',
        function() {

            xit(
            'Should return an error when the definition for a module is not found.',
            function(done) {

            })

        })

    })
});
