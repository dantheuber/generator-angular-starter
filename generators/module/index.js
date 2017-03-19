'use strict';

var getModules = require('../../util/getModules');

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');

module.exports = Generator.extend({
  prompting: function () {
    var modules = getModules(this.contextRoot);
    var promptForModuleName = function () {
      var prompts = [{
        type: 'input',
        name: 'moduleName',
        message: 'What would you like to name this new module?',
        default: 'newModule'
      }];
      return this.prompt(prompts);
    }.bind(this);

    var handlePrompt = function (props) {
      if (_.includes(modules, props.moduleName)) {
        this.log(chalk.red(props.moduleName) + ' module already exists. Choose another name.');
        return promptForModuleName().then(handlePrompt);
      }
      var initPrompt = [{
        type: 'list',
        name: 'initType',
        message: 'Initialize module with which factory?',
        default: 'controller',
        choices: ['controller','service']
      }];
      return this.prompt(initPrompt).then(function (initProps) {
        this.props = _.extend(props, initProps);
      }.bind(this));
    }.bind(this);

    return promptForModuleName().then(handlePrompt);
  },
  writing: function () {
    // create new module
    var newModule = this.props.moduleName;
    var initType = this.props.initType;
    var templateVars = {
      moduleName: newModule,
      moduleNameUp: newModule.charAt(0).toUpperCase() + newModule.slice(1),
      typeLower: initType,
      typeUpper: initType.charAt(0).toUpperCase() + initType.slice(1)
    };
    var moduleDir = 'src/' + newModule;
    var moduleFilePath = moduleDir + '/' + newModule + '.module.js';
    fs.mkdirSync(moduleDir);
    this.fs.copyTpl(
      this.templatePath('module.js'),
      this.destinationPath(moduleFilePath),
      templateVars
    );
    var factDest = 'src/' + newModule + '.' + initType + '.js';
    this.fs.copyTpl(
      this.templatePath('factory.js'),
      this.destinationPath(factDest),
      templateVars
    );
  }
});
