'use strict';

module.exports = RootDirective;
RootDirective.$inject = [];

function RootDirective() {
  return {
    controller: 'RootController',
    controllerAs: 'root',
    restrict: 'E',
    scope: { },
    templateUrl: 'root/root.html'
  };
}
