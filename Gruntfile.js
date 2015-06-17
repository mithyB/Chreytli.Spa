module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            dev: {
                options: {
                    paths: ['**/*.less']
                },
                files: {
                    'css/style.css': 'assets/less/bootstrap.less'
                }
            }
        },
        wiredep: {
            target: {
                src: 'index.html'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-wiredep');

    grunt.registerTask('default', ['wiredep', 'less']);

};