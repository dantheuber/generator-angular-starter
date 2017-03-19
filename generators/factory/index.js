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
      name: 'type',
      message: 'What type of factory would you like to make?',
      default: 'controller',
      choices: ['controller', 'directive', 'service']
    }];

    return this.prompt(prompts).then(function (props) {
      var upperType = props.type.charAt(0).toUpperCase() + props.type.slice(1);
      var type = props.type;
      props.upperType = upperType;

      var namePrompts = [{
        type: 'input',
        name: 'name',
        message: 'What would you like to name this ' + props.type + '?',
        default: 'NewFactory'
      }];

      return this.prompt(namePrompts).then(function (nameProps) {
        var cleaned = nameProps.name.toLowerCase().replace(type, '');
        var newFileName = cleaned + '.' + type + '.js';
        nameProps.newFileName = newFileName;
        var modulePrompts = [{
          type: 'list',
          name: 'module',
          message: 'What module is this ' + type + ' for?',
          choices: modules,
          default: 'root'
        }];

        return this.prompt(modulePrompts).then(function (moduleProps) {
          var moduleName = moduleProps.module;
          var newFilePath = 'src/' + moduleName + '/' + newFileName;
          this.props = _.extend(props, nameProps);
          this.props = _.extend(moduleProps, this.props);
          this.props.newFilePath = newFilePath;
          this.props.typeSuffix = (type === 'service' ? 'svc':'vm');

          if (fs.existsSync(newFilePath)) {
            this.log(chalk.red(newFileName) + ' already exists!');
            process.exit(1);
            return;
          }
        }.bind(this));
      }.bind(this));
    }.bind(this));
  },

  writing: function () {
    var newFileName = this.props.newFileName;
    var moduleName = this.props.module;
    var dest = this.props.newFilePath;
    var type = this.props.type;
    var name = this.props.name;

    switch(type) {
      case 'service':
      case 'controller':
        this.fs.copyTpl(
          this.templatePath('factory.js'),
          this.destinationPath(dest),
          this.props
        );
        break;
      case 'directive':
        this.fs.copyTpl(
          this.templatePath('directive.js'),
          this.destinationPath(dest),
          this.props
        )
        break;
    }

    // update the module file to include this new controller
    var moduleFilePath = path.join(this.contextRoot, 'src/' + moduleName + '/' + moduleName + '.module.js');
    var fileContent = fs.readFileSync(moduleFilePath, 'utf-8');
    var newFactoryLine = '\r\n  .' + type + '(\'' + name + '\', require(\'./'+ newFileName.replace('.js', '') + '\'));'
    var lastThingRegExp = /\.[A-Za-z]+\(\'[A-Za-z\d]+\'\, require\(\'\.\/[A-Za-z\d]+\.[A-Za-z]+\'\)\);/gm;
    var tempMatch = fileContent.match(lastThingRegExp)[0].split('');
    var lastThing = tempMatch.slice(0,tempMatch.length - 1).join('');
    var newModuleFilecontent = fileContent.replace(lastThingRegExp, lastThing + newFactoryLine);
    // override content
    fs.truncateSync(moduleFilePath, 0);
    fs.writeFileSync(moduleFilePath, newModuleFilecontent, { encoding: 'utf-8'});
    this.log(chalk.green('Your new ' + type + ' has been created!'));
  }
});
