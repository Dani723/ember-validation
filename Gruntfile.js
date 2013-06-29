module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
              separator: '\n',
              banner: '// Ember Validation\n// © 2013 Daniel Kuczewski\n// Licensed under MIT license\n// build date: <%= grunt.template.today("dd-mm-yyyy") %>\n',
              process: function(src, filepath) {
                return '(function(window) {\n' + src + '})(this);\n';
              }
            },
            dist: {
                src: [
                  'src/core.js',
                  'src/rules/messages.js',
                  'src/rules/base.js',
                  'src/rules/format.js',
                  'src/rules/numeric.js',
                  'src/rules/text.js',
                  'src/rules/misc.js',
                  'src/result.js',
                  'src/valueValidator.js',
                  'src/objectValidator.js',
                  'src/chaining.js',
                  'src/validators.js',
                  'src/mixins/validator_support.js',
                  'src/mixins/validator_view_support.js',

                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
              banner: '// Ember Validation\n// © 2013 Daniel Kuczewski\n// Licensed under MIT license\n// build date: <%= grunt.template.today("dd-mm-yyyy") %>\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        qunit: {
            files: ['tests/**/*.html']
        },
        jshint: {
            files: [
              'gruntfile.js',
              'src/core.js',
              'src/helpers.js',
              'src/validators/messages.js',
              'src/validators/base.js',
              'src/validators/format.js',
              'src/validators/numeric.js',
              'src/validators/text.js',
              'src/validators/misc.js',
              'src/validators.js',
              'src/result.js',
              'src/chaining.js',
              'src/validator.js',
              'src/mixins/validator_support.js',
              'src/mixins/validator_view_support.js',
              'test/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        yuidoc: {
          compile: {
            name: '<%= pkg.name %>',
            description: '<%= pkg.description %>',
            version: '<%= pkg.version %>',
            url: '<%= pkg.homepage %>',
            options: {
              paths: ['src'],
              outdir: 'docs'
            }
          }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    grunt.registerTask('test', ['qunit']);
    grunt.registerTask('docs', ['yuidoc']);
    grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

};