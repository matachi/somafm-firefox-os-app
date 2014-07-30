'use strict';

module.exports = function(grunt) {

  // The suggested icon sizes on
  // https://developer.mozilla.org/en-US/Apps/Build/Manifest#icons
  // https://developer.mozilla.org/en-US/Marketplace/Publishing/Submission_checklist#For_all_apps_(optional)
  var ICON_SIZES = [32, 60, 90, 120, 128, 256];

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: {
      prod: [
        'dist/css/building-blocks/lists.less',
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
          'dist/js/templates/templates.js': ['src/js/templates/*.html'],
        },
      },
    },

    less: {
      all: {
        files: {
          'dist/css/app.css': ['src/less/app.less'],
        },
      },
    },

    curl: {
      'dist/lib/jquery.min.js': 'http://code.jquery.com/jquery-2.1.1.min.js',
      'dist/lib/xml2json.js': 'https://raw.githubusercontent.com/sergeyt/jQuery-xml2json/master/src/xml2json.js',
      'dist/lib/underscore.min.js': 'http://underscorejs.org/underscore-min.js',
      'dist/lib/backbone.min.js': 'http://backbonejs.org/backbone-min.js',
      'dist/lib/backbone.localStorage.min.js': 'https://raw.githubusercontent.com/jeromegn/Backbone.localStorage/master/backbone.localStorage-min.js',
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
      js: {
        expand: true,
        cwd: 'src/js/',
        src: '{,*/}*.js',
        dest: 'dist/js/',
      },
      buildingBlocks: {
        expand: true,
        cwd: 'bower_components/building-blocks/',
        src: [
          '*/lists.css',
          '*/headers.css',
          '*/headers/images/icons/menu*.png',
          '*/drawer.css',
          '*/drawer/images/ui/{pattern,shadow,header}*.png',
          '!*/drawer/images/ui/pattern_subheader.png',
          '*/toolbars.css',
          '**/media_icons.css',
          '**/media_icons.png',
          '*/progress_activity.css',
          '*/progress_activity/images/ui/default*.png',
          '*/buttons.css',
          '*/buttons/images/ui/{recommend,shadow}.png',
          '*/status.css',
          '*/status/images/ui/pattern.png',
        ],
        dest: 'dist/css/building-blocks/',
        rename: function(dest, src) {
          // Remove `style/, `style_unstable/` or `icons/styles/` from the
          // beginning of the src path
          var stylesStarts = src.indexOf('style');
          var srcWithoutStyles = src.substr(src.indexOf('/', stylesStarts) + 1);
          return dest + srcWithoutStyles;
        },
      },
      // Needs to make a copy of lists.css named lists.less so it can be
      // referenced by app.less to extend the lists header to also use its
      // style for the About header 
      // http://lesscss.org/features/#import-options-reference-example
      buildingBlocksLess: {
        src: 'dist/css/building-blocks/lists.css',
        dest: 'dist/css/building-blocks/lists.less',
      },
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
          'copy:js',
        ],
      },
      less: {
        files: 'src/less/app.less',
        tasks: [
          'less',
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

  grunt.registerTask('default', [
    'jshint',
    'jst',
    'copy:js',
    'curl',

    'copy:html',

    'copy:buildingBlocks',
    'copy:buildingBlocksLess',
    'less',

    'icons',

    'watch',
  ]);

  grunt.registerTask('build', [
    'jshint',
    'jst',
    'copy:js',
    'curl',

    'copy:html',

    'copy:buildingBlocks',
    'copy:buildingBlocksLess',
    'less',

    'icons',

    'clean',
  ]);
};
