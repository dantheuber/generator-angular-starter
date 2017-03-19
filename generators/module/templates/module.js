'use strict';

require('angular').module('<%= moduleName %>', [])
  .<%= typeLower %>('<%= moduleNameUp %><%= typeUpper %>', require('./<%= moduleName %>.<%= typeLower %>'));
