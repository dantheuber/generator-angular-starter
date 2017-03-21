'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

module.exports = Generator.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the spectacular ' + chalk.red('angular-starter') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What would you like to name this project?',
      default: this.appname
    }, {
      type: 'input',
      name: 'author',
      message: 'Authors name?',
      default: ''
    }, {
      type: 'input',
      name: 'githubUsername',
      message: 'Github username?',
      default: 'user'
    }];

    return this.prompt(prompts).then(function (props) {
      var repoPrompts = [{
        type: 'input',
        name: 'repo',
        message: 'Github repo url?',
        default: 'https://github.com/' + props.githubUsername + '/' + props.name + '.git'
      }];

      return this.prompt(repoPrompts).then(function (gitProps) {
        this.props = _.extend(props, gitProps);
      }.bind(this));
    }.bind(this));
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('**/*'),
      this.destinationRoot(),
      this.props,
      { },
      { globOptions: { dot: true } }
    );
  },

  install: function () {
    this.installDependencies();
  },

  end: function () {
    this.spawnCommand('gulp', ['watch']);
  }
});
