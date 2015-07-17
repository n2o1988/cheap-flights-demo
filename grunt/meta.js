/**
 * The banner is the comment that is placed at the top of our compiled
 * source files. It is first processed as a Grunt template, where the `<%=`
 * pairs are evaluated based on this very configuration object.
 */
module.exports = {
  banner:
    '/**\n' +
    ' * <%= package.name %> - v<%= package.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    ' * <%= package.homepage %>\n' +
    ' *\n' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= package.author %>\n' +
    ' * Licensed <%= package.licenses.type %> <<%= package.licenses.url %>>\n' +
    ' */\n'
};