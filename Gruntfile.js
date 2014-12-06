var path = require('path');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  var watchPort = 35729;

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      options: {
        livereload: watchPort
      },
      scripts: {
        files: ['www/src/**/*.js'],
        tasks: ['browserify']
      },
      styles: {
        files: 'www/src/**/*.less',
        tasks: ['styles']
      }
    },
    browserify: {
      main: {
        src: './www/src/main.js',
        dest: './www/dist/main.js'
      }
    },
    less: {
      main: {
        options: {
          paths: ['./'],
          lineNumbers: true
        },
        files: {
          'www/dist/main.css': 'www/src/main.less'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      main: {
        src: 'www/dist/main.css',
        dest: 'www/dist/main.css'
      }
    },
    copy: {
      disthtml: {
        src: './www/src/index.html',
        dest: './www/dist/index.html'
      },
      prodhtml: {
        src: './www/dist/index.html',
        dest: './www/index.html'
      }
    },
    uglify: {
      prod: {
        files: {
          './www/main.js': './www/dist/main.js'
        }
      }
    },
    cssmin: {
      prod: {
        files: {
          './www/main.css': './www/dist/main.css'
        }
      }
    }
  });

  grunt.registerTask('default',   ['dist']);
  grunt.registerTask('styles',    ['less', 'autoprefixer']);
  grunt.registerTask('dist:copy', ['copy:disthtml']);
  grunt.registerTask('dist',      ['styles', 'browserify', 'dist:copy']);
  grunt.registerTask('prod:copy', ['copy:prodhtml']);
  grunt.registerTask('prod',      ['dist', 'uglify:prod', 'cssmin:prod', 'prod:copy']);

};