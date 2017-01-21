/*global module:false*/
module.exports = function(grunt) {
	var settings = require('./settings.js');
  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    jshint: {
		all: './src/**/*.js'
    },
    nodeunit: {
      files: ['test/**/*_test.js']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'nodeunit']
      }
    },
	screeps: {
		options: {
			email: settings.userName,
			password: settings.password,
			branch: settings.branch,
			ptr: false
		},
		dist: {
			src: ['./src/**/*.js']
		}
	}
	
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-screeps');

  // Default task.
  grunt.registerTask('default', ['jshint']);

};
