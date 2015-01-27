
'use strict';

module.exports = function(grunt) {

    grunt.initConfig({

        //----------------------------------
        //
        // jshint
        //
        //----------------------------------

        jshint: {
            grunt: {
                options: {
                    jshintrc: '.jshintrc'
                },
                files: {
                    src: [
                        'gruntfile.js'
                    ]
                }
            },
            src: {
                options: {
                    jshintrc: 'src/.jshintrc'
                },
                files: {
                    src: [
                        'src/**/*.js',
                        '!src/specs/**/*.js'
                    ]
                }
            },
            specs: {
                options: {
                    jshintrc: 'src/specs/.jshintrc'
                },
                files: {
                    src: [
                        'src/specs/**/*.js'
                    ]
                }
            },
        },

        //----------------------------------
        //
        // connect
        //
        //----------------------------------

        connect: {
            specs: {
                options: {
                    hostname: 'localhost',
                    port: grunt.option('connectPort') || 9000,
                    base: '.'
                }
            }
        },

        //----------------------------------
        //
        // mocha
        //
        //----------------------------------

        mocha: {
            options: {
                // requirejs will call `mocha.run()`
                run: false,
                timeout: grunt.option('timeout') || 5000
            },
            specs: {
                options: {
                    urls: [
                        'http://<%= connect.specs.options.hostname %>:<%= connect.specs.options.port %>/'
                    ],
                    reporter: 'Spec'
                }
            }
        },

        clean: []

    })


    grunt.registerTask('debug', function() {
        grunt.log.ok('debugging')
        // jshint debug:true
        debugger
    })

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

    grunt.registerTask(
        'test',
        'Lints and runs all specs.',
        [
            'jshint',
            'connect:specs',
            'mocha:specs',
        ]
    )

    grunt.registerTask(
        'default',
        'Tests and builds.',
        [
            'test',
        ]
    )

    grunt.registerTask(
        'dev',
        'Lints, starts connect and watches for changes.',
        [
            'jshint',
            'connect:specs',
            'watch',
        ]
    )

}
