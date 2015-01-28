//--------------------------------------------------------------------------
//
// carnaby.modular
// Copyright (c) <%= grunt.template.today('yyyy') %> M&C Saatchi
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
