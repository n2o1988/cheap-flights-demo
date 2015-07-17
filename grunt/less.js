module.exports = {
  build: {
    src: [ '<%= app_files.less %>' ],
    dest: '<%= build_dir %>/assets/<%= package.name %>-<%= package.version %>.css',
    options: {
      compile: true,
      compress: false,
      noUnderscores: false,
      noIDs: false,
      zeroUnits: false
    }
  },
  compile: {
    src: [ '<%= less.build.dest %>' ],
    dest: '<%= less.build.dest %>',
    options: {
      compile: true,
      compress: true,
      noUnderscores: false,
      noIDs: false,
      zeroUnits: false
    }
  }
};