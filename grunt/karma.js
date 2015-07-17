/**
 * The Karma configurations.
 */
module.exports = {
  unit: {
    configFile: '<%= build_dir %>/karma-unit.conf.js',
    port: 9101,
    background: true
  },
  continuous: {
    configFile: '<%= build_dir %>/karma-unit.conf.js',
    singleRun: true
  }
};