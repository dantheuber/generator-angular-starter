'use strict';

require('angular');

angular.module('<%= name %>', [
  // require templates file generated by gulp
  require('./templates'),
  // require modules
  require('./root/root.module')
]);
