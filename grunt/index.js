/**
 * The `index` task compiles the `index.html` file as a Grunt template. CSS
 * and JS files co-exist here but they get split apart later.
 */
module.exports = {
  /**
   * During development, we don't want to have wait for compilation,
   * concatenation, minification, etc. So to avoid these steps, we simply
   * add all script files directly to the `<head>` of `index.html`. The
   * `src` property contains the list of included files.
   */
  build: {
    dir: '<%= build_dir %>',
    src: [
      '<%= build_dir %>/src/**/*requirejs_config.js',
      '<%= vendor_files.css %>',
      '<%= less.build.dest %>'
    ]
  },

  /**
   * When it is time to have a completely compiled application, we can
   * alter the above to include only a single JavaScript and a single CSS
   * file. Now we're back!
   */
  compile: {
    dir: '<%= compile_dir %>',
    src: [
      '<%= requirejs.compile.options.out %>',
      '<%= vendor_files.css %>',
      '<%= less.compile.dest %>'
    ]
  }
};