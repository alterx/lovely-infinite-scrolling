module.exports = function( grunt ) {
  'use strict';
  //
  // Grunt configuration:
  //
  // https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
  //

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.initConfig({

    config: grunt.file.readJSON('package.json'),

    // remove files before building
    clean: {
      before: [
        'build/min/lovelyIS-v<%= config.version %>.min.js',
        'build/lovelyIS-v<%= config.version %>.js'
      ],
      after: [
        'src/lovely-infinite-scrolling-pre-build.js'
      ]
    },

    // Build configuration
    // -------------------

    concat: {
      options: {
        stripBanners: true,
        separator: ';'
      },
      prebuild: {
        src: [
          // LIBRARIES
          'src/vendor/jquery.viewport.js',
          'src/lovely-infinite-scrolling.js'
          ],
        dest: 'src/lovely-infinite-scrolling-pre-build.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= config.name %> - v<%= config.version %> */\n'
      },
      release: {
        files: {
          'src/lovely-infinite-scrolling-pre-build.js' : 'build/min/lovelyIS-v<%= config.version %>.min.js',
          'src/lovely-infinite-scrolling-pre-build.js' : 'build/lovelyIS-v<%= config.version %>.js'
        }
      }
    }

  });

  grunt.registerTask('default', ['build']);

  grunt.registerTask('build', ['clean', 'concat', 'uglify:release', 'clean:after']);

};