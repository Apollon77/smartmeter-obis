module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    //Configure a mochaTest task
    mochaTest: {
      test: {
        options: {
    	  reporter: 'spec',
          captureFile: './test/results.txt', // Optionally capture the reporter output to a file
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
        },
        src: ['test/**/*.js']
      }
    },

    //Configure the Istanbul Codecoverage task
    mocha_istanbul: {
        coverage: {
            options: {
        	  reporter: 'spec',
              captureFile: './test/results.txt', // Optionally capture the reporter output to a file
              quiet: false, // Optionally suppress output to standard out (defaults to false)
              clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
            },
            src: ['test/**/*.js']
        }
    }

  });

  //Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks('grunt-mocha-test');

  // Add the grund-mocha-instanbul converage task
  grunt.loadNpmTasks('grunt-mocha-istanbul')

  // Default task(s).
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
};
