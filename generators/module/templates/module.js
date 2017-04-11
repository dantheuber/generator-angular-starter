'use strict';

module.exports = '<%= moduleName %>';

require('angular').module('<%= moduleName %>', [])
  .<%= typeLower %>('<%= moduleNameUp %><%= typeUpper %>', require('./<%= moduleName %>.<%= typeLower %>'));
