/**
 * `coffeelint` does the same as `jshint`, but for CoffeeScript.
 * CoffeeScript is not the default in ngBoilerplate, so we're just using
 * the defaults here.
 */
module.exports = {
  src: {
    files: {
      src: [ '<%= app_files.coffee %>' ]
    }
  },
  test: {
    files: {
      src: [ '<%= app_files.coffeeunit %>' ]
    }
  }
};