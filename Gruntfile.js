module.exports = function (grunt) {
    const sass = require('node-sass');
    //Configuration
    grunt.initConfig({
        //pass in options to plugins, references to files, etc.
        uglify: {
            build: {
                files: [
                    {
                        src: 'assets/predictive-search.js',
                        dest: 'assets/predictive-search.min.js'
                    },   
                {
                    src: 'assets/filtros.js',
                    dest: 'assets/filtros.min.js'
                },
                {
                    src: 'assets/application.js',
                    dest: 'assets/application.min.js'
                },
                {
                    src: 'assets/cart.js',
                    dest: 'assets/cart.min.js'
                },
                {
                    src: 'assets/ultimas-busquedas.js',
                    dest: 'assets/ultimas-busquedas.min.js'
                },
                {
                    src: 'assets/muestras.js',
                    dest: 'assets/muestras.min.js'
                },
                {
                    src: 'assets/wishlist.js',
                    dest: 'assets/wishlist.min.js'
                }

                ]
            }
        },
        cssmin: {
            target: {
                src: 'assets/theme.css',
                dest: 'assets/theme.min.css'
            }
        },
        watch: {
            scripts: {
                files: [
                    'assets/cart.js', 
                    'assets/filtros.js', 
                    'assets/application.js', 
                    'assets/ultimas-busquedas.js', 
                    'assets/muestras.js', 
                    'assets/wishlist.js',
                    'assets/predictive-search.js'],
                tasks: ['uglify']
            },
            css: {
                files: ['assets/theme.css'],
                tasks: ['cssmin'] 
            }
        },
        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            dist: {
                files: {
                    'assets/main.css': 'assets/sss.scss'
                }
            }
        },
        critical: {
            test: {
                options: {
                    base: './',
                    css: [
                        'assets/main.css'
                    ],
                    width: 360,
                    height: 740
                },
                src: 'sections/home-top-background.liquid',
                dest: 'sections/aaaa.liquid'
            }
        }
    });

    //Load plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-critical');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //Register tasks
    grunt.task.registerTask('default', ['concat_css']);
    grunt.registerTask('default', ['sass']);

};