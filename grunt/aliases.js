/**
 * Handle tasks aliases and groups definitions.
 */
module.exports = function(grunt, options) {
  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.js$/ );
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterForCSS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.css$/ );
    });
  }

  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask( 'index', 'Process index.html template', function () {
    var dirRE = new RegExp( '^('+grunt.config('build_dir')+'|'+grunt.config('compile_dir')+')\/', 'g' );
    var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });
    var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });
      

    grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config( 'package.version' )
          }
        });
      }
    });
  });

  /**
   * In order to avoid having to specify manually the files needed for karma to
   * run, we use grunt to manage the list for us. The `karma/*` files are
   * compiled as grunt templates for use by Karma. Yay!
   */
  grunt.registerMultiTask( 'testconfig', 'Process test config templates', function () {
    var jsFiles = filterForJS( this.filesSrc );
    var tplFile = this.files[0].tpl;
    var destFile = this.files[0].dest;

    grunt.file.copy( tplFile, grunt.config( 'build_dir' ) + '/' + destFile, {
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });

  // Return result
  return {
    'default': [
      'build',
      'compile'
    ],
    'dev': [
      'build',
      'connect:server',
      'watch'
    ],
    'build': [
      'clean',
      //'jshint',
      //'coffeelint',
      //'coffee',
      'less:build',
      'concat:build_css',
       'copy:build_crossbrowser',
        'copy:build_server',
      'copy:build_app_assets',
      'copy:build_vendor_assets',
      'copy:build_appjs',
      'copy:build_vendorjs',
      'copy:build_apptpl' ,
      //'testconfig:unit',
      //'karma:continuous',
      'index:build'
    ],
    'compile': [
      'ngAnnotate',
      'less:compile',
      'copy:compile_assets',
      'copy:compile_vendorjs',
      'requirejs:compile',
      'index:compile'
    ],
    'test:unit': [
      'build'
    ],
    'test:e2e': [
      'build',
      'testconfig:e2e',
      'connect:testserver',
      'protractor:e2e'
    ]

  };
};