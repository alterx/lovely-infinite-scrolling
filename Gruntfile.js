module.exports = function( grunt ) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.initConfig({

    config: grunt.file.readJSON('package.json'),

    clean: {
      before: [
        'build/min/lovelyIS-v<%= config.version %>.min.js',
        'build/lovelyIS-v<%= config.version %>.js'
      ]
    },

    concat: {
      options: {
        stripBanners: false
      },
      prebuild: {
        src: [
          'src/vendor/jquery.viewport.js',
          'src/lovely-infinite-scrolling.js'
          ],
        dest: 'build/lovelyIS-v<%= config.version %>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= config.name %> - v<%= config.version %> - <%= config.author %>*/\n'
      },
      release: {
        files: {
          'build/min/lovelyIS-v<%= config.version %>.min.js': 'build/lovelyIS-v<%= config.version %>.js'
        }
      }
    }

  });

  grunt.registerTask('default', ['build']);

  grunt.registerTask('build', ['clean', 'concat', 'uglify:release']);

};