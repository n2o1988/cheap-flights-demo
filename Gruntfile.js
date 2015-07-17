module.exports = function(grunt) {
  var path = require('path');
  /** Load in our build configuration file. */
  var userConfig = require( './build.config.js' );

  require('load-grunt-config')(grunt, {
    // path to task.js files, defaults to grunt dir
    configPath: path.join(process.cwd(), 'grunt'),

    // auto grunt.initConfig
    init: true,

    // data passed into config.  Can use with <%= test %>
    data: userConfig,

    // can optionally pass options to load-grunt-tasks.
    // If you set to false, it will disable auto loading tasks.
    loadGruntTasks: {
      pattern: 'grunt-*',
      config: require('./package.json'),
      scope: 'devDependencies'
    },

    //can post process config object before it gets passed to grunt
    postProcess: function(config) {},

    //allows to manipulate the config object before it gets merged with the data object
    preMerge: function(config, data) {}
  });

};