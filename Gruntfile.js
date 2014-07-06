module.exports = function(grunt) {
  'use strict';

  // The suggested icon sizes on
  // https://developer.mozilla.org/en-US/Apps/Build/Manifest#icons
  var ICON_SIZES = [16, 32, 48, 60, 64, 90, 120, 128, 256];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: ['dist'],
      non_minified_js: ['dist/js/<%= pkg.name %>.js'],
      templates_js: ['dist/js/templates.js'],
    },

    jshint: {
      options: {
        extensions: '.js'
      },
      all: ['Gruntfile.js', 'js/**/*.js']
    },

    jst: {
      compile: {
        files: {
          'dist/js/templates.js': ['js/templates/*.html']
        }
      }
    },

    concat: {
      main: {
        src: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/jquery-xml2json/src/xml2json.js',
          'bower_components/underscore/underscore.js',
          'bower_components/backbone/backbone.js',
          'bower_components/backbone.localstorage/backbone.localStorage.js',
          'dist/js/templates.js',
          'js/models/channel.js',
          'js/collections/channels.js',
          'js/views/channel-view.js',
          'js/views/app-view.js',
          'js/app.js',
        ],
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },

    uglify: {
      main: {
        src: '<%= concat.main.dest %>',
        dest: '<%= concat.main.dest %>'
      }
    },

    copy: {
      manifest: {
        src: 'manifest.webapp',
        dest: 'dist/',
      },
      html: {
        src: 'index.html',
        dest: 'dist/',
      },
      css: {
        files: [
          {
            cwd: 'bower_components/building-blocks/',
            src: [
              '*/lists.css',
              '*/headers.css',
              '*/headers/images/**',
              '*/drawer.css',
              '*/drawer/images/**'
            ],
            dest: 'dist/style/',
            rename: function(dest, src) {
              // Remove `style/` or `style_unstable/` from the beginning of the
              // src path
              return dest + src.substr(src.indexOf('/'));
            },
            expand: true
          },
        ]
      }
    },

    replace: {
      manifest_icon_sizes: {
        src: ['dist/manifest.webapp'],
        overwrite: true,
        replacements: [{
          from: /GRUNT_ICONS/,
          to: function() {
            var call = '';
            ICON_SIZES.forEach(function(element, index, array) {
              // For each icon size, add a reference in the manifest to the
              // icon file:
              //   "128": "/icons/icon-128.png"
              call += '"'+element+'": "/icons/icon-'+element+'.png"';
              if (index != array.length - 1) {
                call += ',\n    ';
              }
            });
            return call;
          }
        }]
      },
      livereload: {
        src: 'dist/index.html',
        overwrite: true,
        replacements: [{
          from: '</body>',
          to: function() {
            return '<script src="http://localhost:35729/livereload.js"></script></body>';
          }
        }]
      },
    },

    exec: {
      export_icons: {
        cmd: function() {
          var call = 'mkdir -p dist/icons/ && ';
          ICON_SIZES.forEach(function(element, index, array) {
            // For each icon size, construct an Inkscape call looking like:
            //   'inkscape -e dist/icons/icon-60.png -C -w 60 -h 60 icons/icon.svg'
            call += 'inkscape -e dist/icons/icon-'+element+'.png -C -w '+element+' -h '+element+' icons/icon.svg';
            if (index != array.length - 1) {
              call += ' && ';
            }
          });
          return call;
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },
      manifest: {
        files: 'manifest.webapp',
        tasks: ['icons']
      },
      js: {
        files: ['Gruntfile.js', 'js/**'],
        tasks: 'compile:dev'
      },
      html: {
        files: 'index.html',
        tasks: ['copy:html', 'replace:livereload']
      },
    },
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('icons', 'Export app icons.', [
    'exec:export_icons', // Create the app icons in `dist/icons/`.
    'copy:manifest',  // Copy the manifest file.
    'replace:manifest_icon_sizes', // Update the manifest with the icon sizes.
  ]);

  grunt.registerTask('minify', ['uglify', 'clean:non_minified_js']);

  grunt.registerTask('compile', ['jshint', 'jst', 'concat', 'clean:templates_js', 'minify']);

  grunt.registerTask('compile:dev', ['jshint', 'jst', 'concat', 'clean:templates_js']);

  grunt.registerTask('default', ['compile', 'copy:html', 'copy:css', 'icons']);
};
