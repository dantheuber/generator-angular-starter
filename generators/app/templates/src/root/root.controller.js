'use strict';

module.exports = RootController;
RootController.$inject = [];

function RootController() {
  var vm = this;

  vm.welcomeMessage = 'Welcome to <%= name %>';
}
