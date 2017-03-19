'use strict';

var getModules = require('../../util/getModules');

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');

module.exports = Generator.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    var modules = getModules(this.contextRoot);
    var prompts = [{
      type: 'list',
      name: 'module',
      message: 'What module is this controller for?',
      choices: modules,
      default: 'root'
    }, {
      type: 'input',
      name: 'controllerName',
      message: 'What would you like to name this controller?',
      default: 'NewController'
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    var moduleName = this.props.module;
    var controllerName = this.props.controllerName;
    var controllerFileName = this.props.controllerName
                                .toLowerCase()
                                .replace('controller', '')
                                + '.controller.js';

    var dest = 'src/' + moduleName + '/' + controllerFileName;
    this.fs.copyTpl(
      this.templatePath('controller.js'),
      this.destinationPath(dest),
      { controllerName: controllerName }
    );
    // update the module file to include this new controller
    var moduleFilePath = path.join(this.contextRoot, 'src/' + moduleName + '/' + moduleName + '.module.js');
    var fileContent = fs.readFileSync(moduleFilePath, 'utf-8');
    var newControllerLine = '\r\n  .controller(\'' + controllerName + '\', require(\'./'+ controllerFileName.replace('.js', '') + '\'));'
    var lastThingRegExp = /\.[A-Za-z]+\(\'[A-Za-z]+\'\, require\(\'\.\/[A-Za-z]+\.[A-Za-z]+\'\)\)(;)/gm;
    var tempMatch = fileContent.match(lastThingRegExp)[0].split('');
    var lastThing = tempMatch.slice(0,tempMatch.length - 1).join('');
    var newModuleFilecontent = fileContent.replace(lastThingRegExp, lastThing + newControllerLine);
    // override content
    fs.truncateSync(moduleFilePath, 0);
    fs.writeFileSync(moduleFilePath, newModuleFilecontent, { encoding: 'utf-8'});
    this.log(chalk.green('Your new controller has been created!'));
  }
});
