'use strict';

module.exports = <%= name %><%= upperType %>;
<%= name %><%= upperType %>.$inject = [];

function <%= name %><%= upperType %> () {
  return {
    restrict: 'E',
    scope: {}
  };
}
