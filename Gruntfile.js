module.exports = function(grunt) {

    require('time-grunt')(grunt);

    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
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
                    '<%= var.pathToDist %><%= var.jsDirectory %><%= pkg.name %>.min.js': ['<%= concat.js.dest %>'],
                    '<%= var.pathToDist %><%= var.jsDirectory %><%= var.vendor %>.min.js': ['<%= concat.vendorJs.dest %>']
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
                    port: "<%= var.portNumber %>",
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
            jpg: {
                files: [{
                    expand: true,
                    cwd: '<%= var.pathToImgTemp %>',
                    src: ['**/*.{jpg,jpeg}'],
                    dest: '<%= var.pathToDist %><%= var.imgDirectory %>'
                }]
            },
            png: {
                files: [{
                    expand: true,
                    cwd: '<%= var.pathToImgTemp %>',
                    src: ['**/*.png'],
                    dest: '<%= var.pathToDist %><%= var.imgDirectory %>'
                }]
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
            dev: [
                "<%= var.pathToDist %>*",
                '!<%= var.pathToDist %>bower_components/**',
                "<%= var.pathToTemp %>"
            ],
            prod: [
                "<%= var.pathToDist %><%= var.jsDirectory %>**/*.js",
                '!<%= var.pathToDist %><%= var.jsDirectory %>**/*.min.*.js',
                "<%= var.pathToDist %><%= var.cssDirectory %>**/*.css",
                '!<%= var.pathToDist %><%= var.cssDirectory %>**/*.min.*.css',
                '<%= var.pathToTemp %>',
                '<%= var.pathToImgTemp %>'
            ]
        },
        compass: {
            dist: {
                options: {
                    sassDir: '<%= var.appName %><%= var.appSass %>',
                    cssDir: '<%= var.pathToTemp %><%= var.cssDirectory %>'
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
                port: "<%= var.portNumber %>", // configure your port here
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
            jpg: {
                files: [
                    '<%= var.appName %><%= var.imgDirectory %>**/*.{jpg,jpeg}'
                ],
                tasks: ['responsive_images', 'copy:jpg']
            },
            png: {
                files: [
                    '<%= var.appName %><%= var.imgDirectory %>**/*.png'
                ],
                tasks: ['responsive_images', 'newer:pngmin', 'copy:png']
            },
            compass: {
                files: [
                    '<%= var.appName %><%= var.appSass %>**/*.scss'
                ],
                tasks: ['compass', 'newer:postcss', 'copy:css']
            },
            bower: {
                files: [
                    'bower.json'
                ],
                tasks: ['wiredep']
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
        wiredep: {
            app: {
                // ignore everything before /bower_components
                ignorePath: new RegExp('.+?(?=/bower_components)'),
                // Point to the files that should be updated when you run `grunt wiredep`
                src: [
                    '<%= var.appName %><%= var.viewsDirectory %>base.html.twig'
                ],
                options: {
                    // See wiredep's configuration documentation for the options you may pass:
                    // https://github.com/taptapship/wiredep#configuration
                }
            },
            scss: {
                src: [
                    '<%= var.appName %><%= var.appSass %><%= var.vendorTmp %>.scss'
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
                        '<%= var.pathToDist %>{<%= var.jsDirectory %>,<%= var.cssDirectory %>}*.min.{js,css}'
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
        pngmin: {
            compile: {
                options: {
                    ext: '.png',
                    force: true
                },
                files: [
                    {
                        expand: true,
                        src: ['**/*.png'],
                        cwd: '<%= var.pathToImgTemp %>',
                        dest: '<%= var.pathToImgTemp %>'
                    }
                ]
            }
        },
        responsive_images: {
            build: {
                options: {
                    sizes: [{
                        name: 'x-small',
                        width: 360
                    },{
                        name: 'small',
                        width: 768,
                        quality: 95
                    },{
                        name: "medium",
                        width: 1024,
                        // suffix: "_x2",
                        quality: 90
                    },{
                        name: "large",
                        width: 1440,
                        // suffix: "_x2",
                        quality: 85
                    },{
                        name: "x-large",
                        width: 1920,
                        // suffix: "_x2",
                        quality: 80
                    },{
                        name: "xx-large",
                        width: 3440,
                        // suffix: "_x2",
                        quality: 65
                    },{
                        name: "i-mac",
                        width: 5120,
                        // suffix: "_x2",
                        quality: 50
                    }]
                },
                files: [{
                    expand: true,
                    src: ['**/*.{jpg,gif,png}'],
                    cwd: '<%= var.appName %><%= var.imgDirectory %>',
                    custom_dest: '<%= var.pathToImgTemp %>{%= width %}/'
                }]
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
            vendorJs: {
                src: [
                    '<%= var.pathToDist %>bower_components/jquery/dist/jquery.js',
                    '<%= var.pathToDist %>bower_components/bootstrap-sass/assets/javascripts/bootstrap.js'
                ],
                dest: '<%= var.pathToDist %><%= var.jsDirectory %><%= var.vendor %>.js'
            },
            css: {
                src: [
                    '<%= var.pathToTemp %><%= var.cssDirectory %>1.css',
                    '<%= var.pathToTemp %><%= var.cssDirectory %>styles.css',
                    '<%= var.pathToTemp %><%= var.cssDirectory %>dev/navbar.css',
                    '<%= var.pathToTemp %><%= var.cssDirectory %>homepage.css'
                ],
                dest: '<%= var.pathToDist %><%= var.cssDirectory %><%= pkg.name %>.css'
            },
            vendorCss: {
                src: [
                    '<%= var.pathToTemp %><%= var.cssDirectory %><%= var.vendorTmp %>.css'
                ],
                dest: '<%= var.pathToDist %><%= var.cssDirectory %><%= var.vendor %>.css'
            }
        },
        cssmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= var.pathToDist %><%= var.cssDirectory %>',
                    src: ['<%= pkg.name %>.css', '<%= var.vendor %>.css'],
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
            'clean:dev',
            'wiredep',
            'compass',
            'postcss',
            'dev_prod_switch',
            'jshint:beforeconcat',
            'responsive_images',
            'newer:pngmin', // works great but only for png
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
