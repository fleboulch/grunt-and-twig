module.exports = function(grunt) {

    require('jit-grunt')(grunt);

    // new grunt-contrib-connect need serve-static
    var serveStatic = require('serve-static');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        appName: 'app/',
        appTrans: 'translations/*.yml',
        appSass: 'scss/',
        pathToDist: 'dist/',
        pathToTemp: '.tmp/',
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
                    //{expand: true, src: ['app/src/*'], dest: '<%= pathToDist %>', filter: 'isFile'},

                    // includes files within path and its sub-directories
                    //{expand: true, src: ['app/src'], dest: '<%= pathToDist %>'},

                    // makes all src relative to cwd
                    // {expand: true, cwd: '<%= appName %><%= appSass %>', src: ['**'], dest: '<%= pathToDist %>'},

                    // flattens results to a single level
                    //{expand: true, flatten: true, src: ['path/**'], dest: '<%= pathToDist %>', filter: 'isFile'},
                ],
            },
            html: {
                files: [
                    {expand: true, cwd: '<%= appName %>', src: ['*.html'], dest: '<%= pathToDist %>'},
                ],
            },
            twig: {
                files: [
                    {expand: true, cwd: '<%= appName %>', src: ['views/**/*.html.twig'], dest: '<%= pathToDist %>'},
                ],
            },
            php: {
                files: [
                    {expand: true, cwd: '<%= appName %>', src: ['*.php'], dest: '<%= pathToDist %>'},
                ],
            },
            translations: {
                files: [
                    {expand: true, cwd: '<%= appName %>', src: ['<%= appTrans %>'], dest: '<%= pathToDist %>'},
                ],
            },
            css: {
                files: [
                    {expand: true, cwd: '<%= pathToTemp %>', src: ['**/styles.css'], dest: '<%= pathToDist %>'},
                ],
            }
        },
        clean: {
            folder: ["<%= pathToDist %>", "<%= pathToTemp %>"]
        },
        compass: {                  // Task
            dist: {
                options: {
                    sassDir: '<%= appName %><%= appSass %>',
                    cssDir: '<%= pathToTemp %>css/'
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
                    base: '<%= pathToDist %>',
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
            translations: {
                files: [
                    '<%= appName %><%= appTrans %>',
                ],
                tasks: ['copy:translations']
            },
            compass: {
                files: [
                    '<%= appName %><%= appSass %>*',
                ],
                tasks: ['compass', 'copy:css']
            },
            livereload: {
                options: {
                    //livereload: '<%= connect.options.livereload %>'
                    livereload: true
                },
                files: [
                    '<%= pathToDist %>**/*'
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
        'copy'
    ]);

};
