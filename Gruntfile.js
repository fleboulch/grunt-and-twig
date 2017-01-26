module.exports = function(grunt) {

    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin',
    });

    // new grunt-contrib-connect need serve-static
    var serveStatic = require('serve-static');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        var: grunt.file.readJSON('grunt/variables.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> */\n'
            },
            build: {
                files: {
                    '<%= var.pathToDist %><%= var.jsDirectory %><%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
                }
            }
        },
        dev_prod_switch: {
            options: {
                // Can be ran as `grunt --env=dev` or ``grunt --env=prod``
                environment: grunt.option('env') || 'dev', // 'prod' or 'dev'
                env_char: '#',
                env_block_dev: 'env:dev',
                env_block_prod: 'env:prod'
            },
            dynamic_mappings: {
                files: [{
                    expand: true,
                    cwd: '<%= var.appName %>',
                    src: ['<%= var.viewsDirectory %>**/*.html.twig'],
                    dest: '<%= var.pathToTemp %>'
                }]
            }
        },
        php: {
            dist: {
                options: {
                    port: 9001,
                    //keepalive: true,
                    open: true,
                    base: 'dist'
                }
            }
        },
        copy: {
            test: {
                files: [
                    // includes files within path
                    //{expand: true, src: ['app/src/*'], dest: '<%= var.pathToDist %>', filter: 'isFile'},

                    // includes files within path and its sub-directories
                    //{expand: true, src: ['app/src'], dest: '<%= var.pathToDist %>'},

                    // makes all src relative to cwd
                    // {expand: true, cwd: '<%= var.appName %><%= var.appSass %>', src: ['**'], dest: '<%= var.pathToDist %>'},

                    // flattens results to a single level
                    //{expand: true, flatten: true, src: ['path/**'], dest: '<%= var.pathToDist %>', filter: 'isFile'},
                ]
            },
            html: {
                files: [
                    {expand: true, cwd: '<%= var.appName %>', src: ['*.html'], dest: '<%= var.pathToDist %>'}
                ]
            },
            twig: {
                files: [
                    {expand: true, cwd: '<%= var.pathToTemp %>', src: ['<%= var.viewsDirectory %>**/*.html.twig'], dest: '<%= var.pathToDist %>'}
                ]
            },
            php: {
                files: [
                    {expand: true, cwd: '<%= var.appName %>', src: ['*.php'], dest: '<%= var.pathToDist %>'}
                ]
            },
            translations: {
                files: [
                    {expand: true, cwd: '<%= var.appName %>', src: ['<%= var.appTrans %>*.yml'], dest: '<%= var.pathToDist %>'}
                ]
            },
            css: {
                files: [
                    {expand: true, cwd: '<%= var.pathToTemp %>', src: ['**/*.css'], dest: '<%= var.pathToDist %>'}
                ]
            },
            js: {
                files: [
                    {expand: true, cwd: '<%= var.appName %>', src: ['<%= var.jsDirectory %>**/*.js'], dest: '<%= var.pathToDist %>'}
                ]
            }
        },
        jshint: {
            beforeconcat: ['<%= var.appName %><%= var.jsDirectory %>**/*.js'],
            afterconcat: ['<%= var.pathToDist %><%= var.jsDirectory %><%= pkg.name %>.js']
        },
        clean: {
            dev: ["<%= var.pathToDist %>", "<%= var.pathToTemp %>"],
            prod: [
                "<%= var.pathToDist %><%= var.jsDirectory %>**/*.js",
                '!<%= var.pathToDist %><%= var.jsDirectory %>**/<%= pkg.name %>.min.*.js',
                "<%= var.pathToDist %><%= var.cssDirectory %>**/*.css",
                '!<%= var.pathToDist %><%= var.cssDirectory %>**/<%= pkg.name %>.min.*.css',
                '<%= var.pathToTemp %>'
            ]
        },
        compass: {
            dist: {
                options: {
                    sassDir: '<%= var.appName %><%= var.appSass %>',
                    cssDir: '<%= var.pathToTemp %>css/'
                }
            }
        },
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({browsers: ['last 40 versions']})
                ]
            },
            dist: {
                src: '<%= compass.dist.options.cssDir %>**/*.css'
            }
        },
        connect: {
            options: {
                port: 9001, // configure your port here
                hostname: 'localhost',
                //base: 'dist', // configure your site distribution path here
                //open: true,
                //keepalive: true,
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: '<%= var.pathToDist %>',
                    middleware: function (connect) {
                        return [
                            serveStatic('dist')
                            //connect.static('dist')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: 'dist'
                }
            }
        },
        watch: {
            html: {
                files: [
                    '<%= var.appName %>*.html'
                ],
                tasks: ['copy:html']
                //options: {
                //livereload: '<%= connect.options.livereload %>'
                //}
            },
            twig: {
                files: [
                    '<%= var.appName %><%= var.viewsDirectory %>{,*/}*.html.twig'
                ],
                tasks: ['dev_prod_switch', 'copy:twig'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            php: {
                files: [
                    '<%= var.appName %>*.php'
                ],
                tasks: ['copy:php']
            },
            js: {
                files: [
                    '<%= var.appName %><%= jsDirectory %>**/*.js'
                ],
                tasks: ['jshint:beforeconcat', 'copy:js']
            },
            translations: {
                files: [
                    '<%= var.appName %><%= var.appTrans %>*.yml'
                ],
                tasks: ['copy:translations']
            },
            compass: {
                files: [
                    '<%= var.appName %><%= var.appSass %>**/*.scss'
                ],
                tasks: ['compass', 'postcss', 'copy:css']
            },
            livereload: {
                options: {
                    //livereload: '<%= connect.options.livereload %>'
                    livereload: true
                },
                files: [
                    '<%= var.pathToDist %>**/*'
                ]
            }
        },
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            source: {
                files: [{
                    src: [
                        '<%= var.pathToDist %><%= var.jsDirectory %><%= pkg.name %>.min.js',
                        '<%= var.pathToDist %><%= var.cssDirectory %><%= pkg.name %>.min.css'
                    ]
                }]
            }
        },
        useminPrepare: {
            html: '<%= var.appName %><%= var.viewsDirectory %>base.html.twig',
            options: {
                // root:'app',
                // dest: 'dist/',
                // staging: 'dist'
                // assetsDirs: ['dist/js']
            }
        },
        concat: {
            options: {
                // separator: ';\n',
            },
            js: {
                src: [
                    '<%= var.appName %><%= var.jsDirectory %>main.js',
                    '<%= var.appName %><%= var.jsDirectory %>main2.js',
                    '<%= var.appName %><%= var.jsDirectory %>dev/dev.js'
                ],
                dest: '<%= var.pathToDist %><%= var.jsDirectory %><%= pkg.name %>.js'
            },
            css: {
                src: [
                    '<%= var.pathToTemp %>css/1.css',
                    '<%= var.pathToTemp %>css/styles.css',
                    '<%= var.pathToTemp %>css/dev/navbar.css'
                ],
                dest: '<%= var.pathToDist %><%= var.cssDirectory %><%= pkg.name %>.css'
            }
        },
        cssmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= var.pathToDist %><%= var.cssDirectory %>',
                    src: ['<%= pkg.name %>.css'],
                    dest: '<%= var.pathToDist %><%= var.cssDirectory %>',
                    ext: '.min.css'
                }]
            }
        },
        usemin: {
            html: [
                '<%= var.pathToDist %><%= var.viewsDirectory %>base.html.twig',
                '<%= var.pathToDist %><%= var.viewsDirectory %>rm.html.twig'
            ],
            // css: ['dist/css/**/*.css'],
            // js: ['dist/js/*.js'],
            options: {
            //     dirs: ['dist/js'],
                assetsDirs: ['<%= var.pathToDist %>']
            //     patterns: {
            //         js: [
            //             [/["']([^:"']+\.(?:png|gif|jpe?g))["']/img, 'Image replacement in js files']
            //         ]
            //     }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= var.pathToDist %>',
                    src: ['<%= var.viewsDirectory %>**/*.html.twig'],
                    dest: '<%= var.pathToDist %>'
                }]
            }
        },
        cleanempty: {
            options: {
                files: false
            },
            src: ['<%= var.pathToDist %>**/*']
        }
    });

    // Load the plugin that provides the "uglify" task.
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['serve']);

    // custom task(s)
    grunt.registerTask('serve', 'Compile then start a connect web server with livereload', function (target) {

        if (target === 'html') {
            return grunt.task.run([
                'build',
                'connect:livereload',
                'watch'
            ]);
        }

        grunt.task.run([
            'build',
            'php',
            'watch'
        ]);
    });

    grunt.registerTask('build', 'Build the app given the env option\n- If --env=prod option is added it\'s a prod build,\n- else, it\'s a dev build', function () {

        grunt.task.run([
            'clean',
            'compass',
            'postcss',
            'dev_prod_switch',
            'jshint:beforeconcat',
            'copy'
        ]);

        // if '--env=prod' option is passed
        if (grunt.option('env') === 'prod') {
            grunt.task.run([
                'prod'
            ]);
        }

    });

    grunt.registerTask('prod', [
        'useminPrepare',
        'concat',
        'jshint:afterconcat',
        'cssmin:build',
        'uglify:build',
        'filerev',
        'usemin',
        'htmlmin',
        'clean:prod',
        'cleanempty'
    ]);

};
