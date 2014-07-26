'use strict';

module.exports = function(grunt) {

  // The suggested icon sizes on
  // https://developer.mozilla.org/en-US/Apps/Build/Manifest#icons
  var ICON_SIZES = [16, 32, 48, 60, 64, 90, 120, 128, 256];

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: {
      prod: [
        'dist/js/script.js',
        'dist/js/templates.js',
        'dist/css/*.css',
        '!dist/css/*.min.css',
      ],
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      all: [
        'Gruntfile.js',
        'src/js/**/*.js',
      ],
    },

    jst: {
      all: {
        options: {
          processName: function(filepath) {
            return filepath.substring(filepath.indexOf('/') + 1);
          },
        },
        files: {
          'dist/js/templates.js': ['src/js/templates/*.html'],
        },
      },
    },

    concat: {
      all: {
        src: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/jquery-xml2json/src/xml2json.js',
          'bower_components/underscore/underscore.js',
          'bower_components/backbone/backbone.js',
          'bower_components/backbone.localstorage/backbone.localStorage.js',
          'dist/js/templates.js',
          'src/js/models/channel.js',
          'src/js/models/playback.js',
          'src/js/collections/channels.js',
          'src/js/views/channel-view.js',
          'src/js/views/playback-view.js',
          'src/js/views/app-view.js',
          'src/js/app.js',
        ],
        dest: 'dist/js/script.min.js',
      },
    },

    uglify: {
      prod: {
        src: '<%= concat.all.dest %>',
        dest: '<%= concat.all.dest %>',
      },
    },

    cssmin: {
      all: {
        files: {
          'dist/css/style.min.css': ['dist/css/*.css', '!dist/css/*.min.css'],
        },
      },
    },

    copy: {
      manifest: {
        expand: true,
        src: 'src/manifest.webapp',
        dest: 'dist/',
        flatten: true,
      },
      html: {
        expand: true,
        src: 'src/index.html',
        dest: 'dist/',
        flatten: true,
      },
      buildingBlocks: {
        cwd: 'bower_components/building-blocks/',
        src: [
          '*/lists.css',
          '*/headers.css',
          '*/headers/images/**',
          '*/drawer.css',
          '*/drawer/images/**',
          '*/toolbars.css',
          '**/media_icons.css',
          '**/media_icons.png',
        ],
        dest: 'dist/css/',
        rename: function(dest, src) {
          // Remove `styles/, `styles_unstable/` or `icons/styles/` from the
          // beginning of the src path
          var stylesStarts = src.indexOf('styles');
          var srcWithoutStyles = src.substr(src.indexOf('/', stylesStarts) + 1);
          return dest + srcWithoutStyles;
        },
        expand: true,
      },
      css: {
        expand: true,
        src: 'src/css/app.css',
        dest: 'dist/css/',
        flatten: true,
      }
    },

    replace: {
      manifestIconSizes: {
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
              if (index !== array.length - 1) {
                call += ',\n    ';
              }
            });
            return call;
          }
        }]
      },
    },

    exec: {
      exportIcons: {
        cmd: function() {
          var call = 'mkdir -p dist/icons/ && ';
          ICON_SIZES.forEach(function(element, index, array) {
            // For each icon size, construct an Inkscape call looking like:
            //   'inkscape -e dist/icons/icon-60.png -C -w 60 -h 60 icons/icon.svg'
            call += 'inkscape -e dist/icons/icon-'+element+'.png -C -w '+element+' -h '+element+' src/icons/icon.svg';
            if (index !== array.length - 1) {
              call += ' && ';
            }
          });
          return call;
        }
      }
    },

    watch: {
      js: {
        files: [
          'Gruntfile.js',
          'src/js/**',
        ],
        tasks: [
          'jshint',
          'jst',
          'concat',
        ],
      },
      css: {
        files: 'src/css/app.css',
        tasks: [
          'copy:css',
          'cssmin',
        ],
      },
      manifest: {
        files: 'src/manifest.webapp',
        tasks: [
          'copy:manifest',
          'replace:manifestIconSizes',
        ],
      },
      html: {
        files: 'src/index.html',
        tasks: [
          'copy:html',
        ],
      },
    },
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('icons', 'Export app icons.', [
    'exec:exportIcons', // Create the app icons in `dist/icons/`.
    'copy:manifest',  // Copy the manifest file.
    'replace:manifestIconSizes', // Update the manifest with the icon sizes.
  ]);

  grunt.registerTask('buildCss', [
    'copy:buildingBlocks',
    'copy:css',
    'cssmin',
  ]);

  grunt.registerTask('default', [
    'jshint',
    'jst',
    'concat',

    'copy:html',

    'buildCss',

    'icons',

    'watch',
  ]);

  grunt.registerTask('build', [
    'jshint',
    'jst',
    'concat',
    'uglify',

    'copy:html',

    'buildCss',

    'icons',

    'clean',
  ]);
};
