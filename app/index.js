'use strict';

var generator = require( 'yeoman-generator' ),
	async = require( 'async' ),
	chalk = require( 'chalk' ),
	path = require( 'path' );

var LibGenerator = generator.Base.extend(
	{
		constructor: function () {
			var dirPath = '../templates';

			generator.Base.apply( this, arguments );

			this.sourceRoot( path.join( __dirname, dirPath ) );
		},

		options: function () {
			var done = this.async();
			this.basename = path.basename( this.env.cwd );

			var prompts = [
				{
					name:    'namespace',
					message: 'Project Namespace',
					default: 'TenUp'
				},
				{
					name:    'projectName',
					message: 'Project Name',
					default: 'WPLib'
				},
				{
					name:    'description',
					message: 'Description',
					default: 'The best WordPress extension ever made!'
				},
				{
					name:    'projectHome',
					message: 'Project homepage'
				},
				{
					name:    'authorName',
					message: 'Author name',
					default: this.user.git.name
				},
				{
					name:    'authorEmail',
					message: 'Author email',
					default: this.user.git.email
				},
				{
					name:    'authorUrl',
					message: 'Author URL'
				}
			];

			// Gather initial settings
			this.prompt( prompts, function ( properties ) {
				this.opts = properties;

				this.className = this.opts.projectName.replace( /[\s]/g, '_' ).replace( /[-]/g, '_' );

				done();
			}.bind( this ) );
		},

		init: function () {
			this.pkg = require( '../package.json' );

			this.on( 'end', function () {

			} );
		},

		welcome: function () {
			this.log( chalk.magenta( 'Thanks for generating a WordPress library with yo!' ) );
		},

		composer: function () {
			this.template( '_composer.json', 'composer.json' );
		},

		git: function () {
			this.copy( '_gitignore', '.gitignore' );
		}
	}
);

// Export the module
module.exports = LibGenerator;