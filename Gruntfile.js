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
        copy: {
            test: {
                files: [
                    // includes files within path
                    //{expand: true, src: ['app/src/*'], dest: 'app/dist/', filter: 'isFile'},

                    // includes files within path and its sub-directories
                    //{expand: true, src: ['app/src'], dest: 'app/dist/'},

                    // makes all src relative to cwd
                    {expand: true, cwd: '<%= appName %>scss/', src: ['**'], dest: '<%= appName %>dist/scss/'},

                    // flattens results to a single level
                    //{expand: true, flatten: true, src: ['path/**'], dest: 'dist/', filter: 'isFile'},
                ],
            },
            html: {
                files: [
                    {expand: true, cwd: '<%= appName %>', src: ['*.html'], dest: '<%= appName %>dist/'},
                ],
            }
        },
        clean: {
            folder: ["<%= appName %>dist/", ".tmp/"]
        },
        compass: {                  // Task
            dist: {
                options: {
                    sassDir: '<%= appName %>scss/',
                    cssDir: '<%= appName %>dist/css/'
                }
            }
        },
        connect: {
            options: {
                port: 9001, // configure your port here
                hostname: 'localhost',
                //base: '<%= appName %>dist', // configure your site distribution path here
                //open: true,
                //keepalive: true,
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: '<%= appName %>dist/',
                    middleware: function (connect) {
                        return [
                            serveStatic('app/dist')
                            //connect.static('app/dist')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: 'app/dist'
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
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    'app/dist/index.html'

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

        grunt.task.run([
            'connect:livereload',
            'watch'
        ]);
    });
};