/**
 * Connect is a http server provided by grunt.
 * server - http server started on watch
 * serversa - http server stand-alone
 * servercompilesa - http server stand-alone pointing to compile_dir
 * testserver - http server used for e2e testing
 */
module.exports = {
  options: {
    port: 8000,
    base: '<%= build_dir %>/'
  },
  server: {
    options: {
      keepalive: false
    }
  },
  serversa: {
    options: {
      keepalive: true
    }
  },
  servercompilesa: {
    options: {
      base: '<%= compile_dir %>/',
      keepalive: true
    }
  },
  testserver: {
    options: {
      port: 8100,
      keepalive: false
    }
  }
};