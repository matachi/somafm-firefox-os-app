module.exports = function(grunt) {
  'use strict';

  // The suggested icon sizes on https://developer.mozilla.org/en-US/Apps/Build/Manifest#icons
  var ICON_SIZES = [16, 32, 48, 60, 64, 90, 120, 128, 256];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: ['dist'],
      non_minified_js: ['dist/js/<%= pkg.name %>.js']
    },

    concat: {
      main: {
        src: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/underscore/underscore.js',
          'bower_components/backbone/backbone.js',
          'js/models/station.js',
          'js/collections/stations.js',
          'js/views/app-view.js',
          'js/app.js',
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      main: {
        src: '<%= concat.main.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },

    copy: {
      main: {
        files: [
          {
            src: ['index.html', 'manifest.webapp'],
            dest: 'dist/'
          },
          {
            cwd: 'bower_components/building-blocks/',
            src: ['style_unstable/lists.css', '*/headers.css', '*/switches.css', '*/buttons.css'],
            dest: 'dist/style/',
            flatten: true,
            expand: true
          }
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
      }
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
      main: {
        files: ['index.html', 'manifest.webapp', 'js/**'],
        tasks: ['copy', 'compile']
      }
    },
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('icons', ['copy', 'exec:export_icons', 'replace:manifest_icon_sizes']);

  grunt.registerTask('minify', ['uglify', 'clean:non_minified_js']);

  grunt.registerTask('compile', ['concat', 'minify']);

  grunt.registerTask('default', ['compile', 'icons']);
};
