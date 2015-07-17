/**
 * This task compiles the karma template so that changes to its file array
 * don't have to be managed manually.
 */
module.exports = {
  unit: {
    tpl: 'test/config/karma-unit.tpl.js',
    dest: 'karma-unit.conf.js',
    src: [
      '<%= vendor_files.js %>',
      '<%= vendor_files.test_js %>',
      '<%= vendor_files.require_js %>',
      '<%= test_files.js %>'
    ]
  },
  e2e: {
    tpl: 'test/config/protractor-e2e.tpl.js',
    dest: 'protractor-e2e.conf.js',
    src: [
    ]
  }
};