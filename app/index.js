var generators = require('yeoman-generator');
var shortid = require('shortid');

module.exports = generators.Base.extend({

    /**
    * Copy the scaffold files to the user directory.
    */
    scaffold: function()
    {
        this.fs.copy(
            this.templatePath('../scaffold'),
            this.destinationPath()
        );
    },

    /**
    * Get the user configuration info.
    */
    prompting: function()
    {
        var inputs = [
          {type: 'input', name:'appName', default:'myApp',                message:"Application name"},
          {type: 'input', name:'desc',    default:'Express MVC application',message:"Application description"},
          {type: 'input', name:'appKey',  default:shortid.generate(),     message:"Unique application key"},
          {type: 'input', name:'url',     default:"http://localhost",     message:"URL"},
          {type: 'input', name:'port',    default:8081,                   message:"Port"},
          {type: 'input', name:'db',      default:"localhost/expressmvc", message:"MongoDB Database URI"},
        ];

        return this.prompt(inputs).then(function(answers) {

            // Create the configuration file.
            this.fs.copyTpl(
                this.templatePath('env.template'),
                this.destinationPath('app/config/env.js'),
                answers
            );

            // Create the package.json.
            this.fs.copyTpl(
                this.templatePath('package.template'),
                this.destinationPath('package.json'),
                answers
            );
        }.bind(this));
    },


    installation: function()
    {
        this.npmInstall([
            'breachofmind/express-mvc'
        ], {save: true});

        this.npmInstall([
            'gulp',
            'gulp-concat',
            'gulp-autoprefixer',
            'gulp-sass',
            'gulp-livereload',
        ], {saveDev: true});
    },

    done: function()
    {
        console.log('Finished! Type npm run start.');
    }
});
