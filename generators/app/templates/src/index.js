'use strict';

require('angular');

angular.module('<%= name %>', [])
  .controller('RootController', require('./root/root.controller'));
