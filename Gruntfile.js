module.exports = function(grunt) {

    require('jit-grunt')(grunt);

    // new grunt-contrib-connect need serve-static
    var serveStatic = require('serve-static');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        appName: 'app/',
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
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
                    //{expand: true, src: ['app/src/*'], dest: 'dist/', filter: 'isFile'},

                    // includes files within path and its sub-directories
                    //{expand: true, src: ['app/src'], dest: 'dist/'},

                    // makes all src relative to cwd
                    {expand: true, cwd: '<%= appName %>scss/', src: ['**'], dest: 'dist/scss/'},

                    // flattens results to a single level
                    //{expand: true, flatten: true, src: ['path/**'], dest: 'dist/', filter: 'isFile'},
                ],
            },
            html: {
                files: [
                    {expand: true, cwd: '<%= appName %>', src: ['*.html'], dest: 'dist/'},
                ],
            },
            twig: {
                files: [
                    {expand: true, cwd: '<%= appName %>', src: ['views/**/*.html.twig'], dest: 'dist/'},
                ],
            },
            php: {
                files: [
                    {expand: true, cwd: '<%= appName %>', src: ['*.php'], dest: 'dist/'},
                ],
            },
            css: {
                files: [
                    {expand: true, cwd: '.tmp/css/', src: ['styles.css'], dest: 'dist/css/'},
                ],
            }
        },
        clean: {
            folder: ["dist/", ".tmp/"]
        },
        compass: {                  // Task
            dist: {
                options: {
                    sassDir: '<%= appName %>scss/',
                    cssDir: '.tmp/css/'
                }
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
                    base: 'dist/',
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
                    '<%= appName %>index.html',
                ],
                tasks: ['copy:html']
                //options: {
                //livereload: '<%= connect.options.livereload %>'
                //}
            },
            twig: {
                files: [
                    '<%= appName %>views/{,*/}*.html.twig',
                ],
                tasks: ['copy:twig'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            php: {
                files: [
                    '<%= appName %>index.php',
                ],
                tasks: ['copy:php']
            },
            compass: {
                files: [
                    '<%= appName %>/scss/*',
                ],
                tasks: ['compass', 'copy:css']
            },
            livereload: {
                options: {
                    //livereload: '<%= connect.options.livereload %>'
                    livereload: true
                },
                files: [
                    'dist/index.html',
                    'dist/css/*',
                    'dist/index.php'
                ]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

    // custom task(s)
    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {

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

    grunt.registerTask('build', [
        'clean',
        'compass',
        'copy:html',
        'copy:php',
        'copy:css',
        'copy:twig'
    ]);

};