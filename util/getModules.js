'use strict';

var fs = require('fs');
var path = require('path');

module.exports = getModules;

function getModules(context) {
  var srcPath = path.join(context, 'src');
  return fs.readdirSync(srcPath)
           .filter(returnDirectories);

  function returnDirectories(file) {
    var filePath = path.join(srcPath, file);
    return fs.statSync(filePath).isDirectory();
  }
};
