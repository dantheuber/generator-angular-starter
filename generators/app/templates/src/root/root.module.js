'use strict';

module.exports = 'rootModule';

require('angular').module('rootModule', [])
  .controller('RootController', require('./root.controller'))
  .directive('root', require('./root.directive'));
