/**
 * Requirejs optimization plugin
 */
module.exports = {
  compile: {
    options: {
      optimize: "uglify2",
      baseUrl: '<%= build_dir %>/src/app',
      mainConfigFile: '<%= build_dir %>/src/app/requirejs_config.js',
      name: 'requirejs_config',
      out: '<%= compile_dir %>/assets/<%= package.name %>-<%= package.version %>.js',
      wrap: {
        start: '<%= meta.banner %>'
      }
    }
  }
};