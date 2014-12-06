/*
 * Copyright (c) 2014 Will Shown. All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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