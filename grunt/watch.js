/**
 * And for rapid development, we have a watch set up that checks to see if
 * any of the files listed below change, and then to execute the listed
 * tasks when they do. This just saves us from having to type "grunt" into
 * the command-line every time we want to see what we're working on; we can
 * instead just leave "grunt watch" running in a background terminal. Set it
 * and forget it, as Ron Popeil used to tell us.
 *
 * But we don't need the same thing to happen for all the files.
 */
module.exports = {
  options: {
  },
  /**
   * When the Gruntfile changes, we just want to lint it. In fact, when
   * your Gruntfile changes, it will automatically be reloaded!
   */
  gruntfile: {
    files: 'Gruntfile.js',
    tasks: [ 'jshint:gruntfile' ],
    options: {
      reload: true
    }
  },

  /**
   * When our JavaScript source files change, we want to run lint them and
   * run our unit tests.
   */
  jssrc: {
    files: [
      '<%= app_files.js %>'
    ],
    tasks: [ 'jshint:src', 'karma:unit:run', 'copy:build_appjs' ]
  },

  /**
   * When our CoffeeScript source files change, we want to run lint them and
   * run our unit tests.
   */
  coffeesrc: {
    files: [
      '<%= app_files.coffee %>'
    ],
    tasks: [ 'coffeelint:src', 'coffee:source', 'karma:unit:run', 'copy:build_appjs' ]
  },

  /**
   * When assets are changed, copy them. Note that this will *not* copy new
   * files, so this is probably not very useful.
   */
  assets: {
    files: [
      'src/assets/**/*'
    ],
    tasks: [ 'copy:build_assets' ]
  },

  /**
   * When index.html changes, we need to compile it.
   */
  html: {
    files: [ '<%= app_files.html %>' ],
    tasks: [ 'index:build' ]
  },

  /**
   * When our templates change, we only rewrite the template cache.
   */
  tpls: {
    files: [
      '<%= app_files.atpl %>',
      '<%= app_files.ctpl %>'
    ],
    tasks: [ 'copy:build_apptpl' ]
  },

  /**
   * When the CSS files change, we need to compile and minify them.
   */
  less: {
    files: [ 'src/**/*.less' ],
    tasks: [ 'less:build' ]
  },

  /**
   * When a JavaScript unit test file changes, we only want to lint it and
   * run the unit tests. We don't want to do any live reloading.
   */
  jsunit: {
    files: [
      '<%= app_files.jsunit %>'
    ],
    tasks: [ 'jshint:test', 'karma:unit:run' ],
    options: {
      livereload: false
    }
  },

  /**
   * When a CoffeeScript unit test file changes, we only want to lint it and
   * run the unit tests. We don't want to do any live reloading.
   */
  coffeeunit: {
    files: [
      '<%= app_files.coffeeunit %>'
    ],
    tasks: [ 'coffeelint:test', 'karma:unit:run' ],
    options: {
      livereload: false
    }
  }
};