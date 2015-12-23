module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            
            build: ['Gruntfile.js', 'app.js', 'app.config.js', 'globalConfig.js', 'app/**/*.js']
        },
        
        uglify: {
            options: {
                report: 'min',
                mangle: false
            }
        },
        
        less: {
            build: {
                files: {
                    'css/bootstrap.css': 'assets/less/*.less'
                }
            }
        },

        //less: {
        //    dev: {
        //        options: {
        //            paths: ['**/*.less']
        //        },
        //        files: {
        //            'css/style.css': 'assets/less/bootstrap.less'
        //        }
        //    }
        //},

        concat: {
            options: {
                seperator: ';'
            }//,
            //js: {
            //    src: ['app.js', 'app.config.js', 'globalConfig.js', 'app/**/*.js'],
            //    dest: '.dist/js/app.js'
            //},
            //css: {
            //    src: ['css/**/*.css'],
            //    dest: '.dist/css/app.css'
            //}
        },

        //processhtml: {
        //    build: {
        //        files: {
        //            '.dist/index.html': ['index.html']
        //        }
        //    }
        //},

        copy: {
            main: {
                files: [
                  {
                      expand: true,
                      src: [
                          'index.html',
                          'app/**/*.html',
                          'images/**/*.*',
                          'favicon.ico'
                      ], dest: '.dist/'
                  },
                  {
                      //for bootstrap fonts
                      expand: true,
                      dot: true,
                      cwd: 'bower_components/bootstrap/dist',
                      src: ['fonts/*.*'],
                      dest: '.dist'
                  }, {

                      //for font-awesome
                      expand: true,
                      dot: true,
                      cwd: 'bower_components/fontawesome',
                      src: ['fonts/*.*'],
                      dest: '.dist'
                  }
                ],
            }
        },

        wiredep: {
            target: {
                src: 'index.html'
            }
        },
        
        connect: {
            server: {
                options: {
                    port: 1337,
                    hostname: 'localhost',
                    base: '.dist',
                    open: true,
                    keepalive: true
                }
            }
        },
        
        useminPrepare: {
            html: 'index.html',
            options: {
                dest: '.dist'
            }
        },
        
        usemin: {
            html: '.dist/index.html',
            options: {
                assetsDir: '.dist'
            }
        },
        
        ftpush: {
            build: {
                auth: {
                    host: 'chreyt.li',
                    port: 21,
                    authKey: 'Chreytli'
                },
                src: '.dist',
                //dest: '/pre-release'
                dest: '/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    //grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-ftpush');

    grunt.registerTask('default', ['wiredep', 'jshint']);

    grunt.registerTask('build', ['default', 'useminPrepare', 'concat:generated', 'cssmin:generated', 'uglify:generated', /*'processhtml',*/'copy', 'usemin']);

    grunt.registerTask('serve', ['build', 'connect']);

    grunt.registerTask('deploy', ['build', 'ftpush']);

};