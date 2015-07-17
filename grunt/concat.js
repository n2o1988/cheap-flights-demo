/**
 * `grunt concat` concatenates multiple source files into a single file.
 */
module.exports = {
  /**
   * The `build_css` target concatenates compiled CSS and vendor CSS
   * together.
   */
  build_css: {
    src: [
      '<%= vendor_files.css %>',
      '<%= less.build.dest %>'
    ],
    dest: '<%= less.build.dest %>'
  }
};