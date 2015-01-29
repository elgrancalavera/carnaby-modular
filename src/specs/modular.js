// Tests for errors
// leon.coto@mcsaatchi.com

// jshint unused:false
// jshint newcap: false
define(function (require) {
    'use strict';

    var Modular = require('modular')
    , $ = require('jquery')
    , expect = require('chai').expect
    , Marionette = require('backbone.marionette')
    , Module1 = require('./module-1')
    , Module2 = require('./module-2')

    describe('Errors', function() {

        describe(
        'Invalid Selections:',
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
        'Global Configuration:',
        function() {

            it(
            'Should return an error when a global configuration key is given ' +
            'and a global configuration object is not found.',
            function(done) {
                Modular({
                    $el: $('#app'),
                    configKey: 'nothing'
                }, function(err) {
                    expect(err).to.be.instanceof(Modular.MissingConfigurationError)
                    done()
                })
            })

        })

        describe(
        'Errors on Module Definitions:',
        function() {

            it(
            'Should return an error when the definition for any module is not specified.',
            function(done) {
                Modular({
                    $el: $('#missing-defs')
                }, function(err) {
                    expect(err).to.be.instanceof(Modular.MissingDefinitionError)
                    done()
                })
            })

            it(
            'Should return an error when one or more definitions fail to load.',
            function(done) {
                Modular({
                    $el: $('#fail-to-load-defs')
                }, function(err) {
                    expect(err).to.be.instanceof(Modular.FailedToLoadDefinitionError)
                    done()
                })
            })
        })

    })

    describe('Marionette.Application', function () {

        var err, result

        before(function(done) {
            Modular({
                $el: $('#app'),
                configKey: 'globalConfig'
            }, function(err_, result_) {
                err = err_
                result = result_
                done()
            })
        })

        it(
        'Should return null in the error',
        function() {
            expect(err).to.be.null()
        })

        it(
        'Should return a Marionette.Application.',
        function() {
            expect(result.app).to.be.instanceof(Marionette.Application)
        })

        it(
        'Should be properly configured.',
        function() {
            expect(result.options['level-0']).to.be.ok()
            expect(result.options['level-0'].$el).to.be.ok()
            expect(result.options['level-0'].model).to.deep.equal({
                foo: 'bar'
            })
        })
    })
});
