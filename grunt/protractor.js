/**
 * Protractor configuration
 */
module.exports = {
  options: {
    configFile: "node_modules/grunt-protractor-runner/node_modules/protractor/referenceConf.js", // Default config file
    keepAlive: true, // If false, the grunt process stops when the test fails.
    noColor: false, // If true, protractor will not use colors in its output.
    args: {
      // Arguments passed to the command
    }
  },
  e2e: {
    options: {
      configFile: "build/protractor-e2e.conf.js", // Target-specific config file
      args: {
        baseUrl: 'http://localhost:8100'
      }
    }
  }
};