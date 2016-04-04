module.exports = function(grunt) {

  // after this script is run (or stopped after watching),
  // time for tasks longer than 1% of the total time are output
  require('time-grunt')(grunt);



  grunt.initConfig({


    /**
     *
     * Update packages automatically
     *
     */

    devUpdate: {
        main: {
            options: {
                updateType: 'force', // update outdated packages
                reportUpdated: false, //don't report up-to-date packages
                semver: true, //stay within semver when updating
                packages: {
                    devDependencies: true, //only check for devDependencies
                    dependencies: false
                },
                packageJson: null, //use matchdep default findup to locate package.json
                reportOnlyPkgs: [] //use updateType action on all packages
            }
        }
    },



    /**
     *
     * Execute shell commands
     *
     */

    shell: {
      // Show current weather
      weather: {
        command: "curl -s http://wttr.in/Gothenburg | head -7"
      }
    },





    /**
     *
     * Compile Sass to CSS
     *
     */

     sass: {

       styles: {
         options: {
           sourcemap: 'none',
           outputStyle: 'expanded',
           lineComments: false,
           debugInfo: false,
           noCache: true
         },

         files: [{
           expand: true,
           cwd: 'css/scss',
           src: ['*.scss'],
           dest: 'css',
           ext: '.css'
         }]
       }
     },





//      scsslint: {
//          allFiles: [
//            'css/scss/*.scss',
//          ],
//          options: {
// //           bundleExec: true,
//            config: '.scss-lint.yml',
//            reporterOutput: 'scss-lint-report.xml',
//            colorizeOutput: true
//          },
//        },
//



     /**
      *
      * Pack identical media queries together into single media query rule
      *
      */

     css_mqpacker: {
       options: {
         map: false,
         sort: true
       },
       main: {
         cwd: 'css',
         dest: 'css',
         expand: true,
         src: ["**/*.css"]
       }
     },





     /**
      *
      * Process CSS with PostCSS plugins
      *
      */

     postcss: {
       styles: {
         options: {
           map: false, // inline sourcemaps

           processors: [
             require('postcss-discard-duplicates'), // removes duplicate rules
             require('postcss-merge-rules'), // merge adjacent css rules
             require('pixrem')(), // add fallbacks for rem units
             require('autoprefixer')({browsers: ['last 3 versions', 'ie 8', 'ie 9', '> 1%']}) // add vendor prefixes
           ]
         },
         src: 'css/*.css'
       }
     },





     /**
      *
      * Minify CSS
      *
      */

     cssmin: {
       css:{
         files: [{
           expand: true,
           cwd: 'css',
           src: ['*.css'],
           dest: 'css',
           ext: '.min.css'
         }]
       }
     },



  });




  /**
   *
   * Load packages
   *
   */

  // Scaffolding packages
  grunt.loadNpmTasks('grunt-dev-update');
  grunt.loadNpmTasks('grunt-shell');

  // Real stuff :)
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-css-mqpacker');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-cssmin');




  /**
   *
   * Register tasks
   *
   */

  // Default task
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['shell:weather', 'devUpdate']);

  // single tasks
  grunt.registerTask('css', ['sass:styles']);
  grunt.registerTask('pack', ['css_mqpacker']);
  grunt.registerTask('post', ['postcss:styles']);
  grunt.registerTask('min', ['cssmin']);


};
