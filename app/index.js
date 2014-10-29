'use strict';

var generator = require( 'yeoman-generator' ),
	async = require( 'async' ),
	chalk = require( 'chalk' ),
	path = require( 'path' );

var LibGenerator = generator.Base.extend(
	{
		constructor: function() {
			var dirPath = '../templates';

			generator.Base.apply( this, arguments );

			this.sourceRoot( path.join( __dirname, dirPath ) );
		},

		options: function() {
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
					name:    'gitUser',
					message: 'GitHub Account Name',
					default: '10up'
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
			this.prompt( prompts, function( properties ) {
				this.opts = properties;

				this.opts.className = this.opts.projectName.replace( /[\s]/g, '_' ).replace( /[-]/g, '_' );

				done();
			}.bind( this ) );
		},

		init: function() {
			this.pkg = require( '../package.json' );

			this.on( 'end', function () {
				var i, length, installs = [],
					chalks = { skipped:[], run:[] },
					installers = ['composer'];

				this.log( chalk.green.bold( 'Your plugin has been generated.' ));

				for ( i = 0, length = installers.length; i < length; i++ ) {
					if ( this.options['skip-install'] || this.options[ 'skip-' + installers[ i ] ] ) {
						chalks.skipped.push( chalk.yellow.bold( installers[ i ] + ' install' ));
					} else {
						chalks.run.push( chalk.yellow.bold( installers[ i ] + ' install' ));
						installs.push( _install( installers[ i ],this ));
					}
				}

				if ( 0 < chalks.skipped.length ) {
					this.log( 'Skipping ' + chalks.skipped.join( ', ' ) + '. Just run yourself when you are ready.' );
				}
				if ( 0 < installs.length ) {
					this.log( 'Running ' + chalks.run.join( ', ' ) + ' for you. If this fails try running yourself.' );
					async.parallel( installs );
				}
			} );
		},

		welcome: function() {
			this.log( chalk.magenta( 'Thanks for generating a WordPress library with yo!' ) );
		},

		composer: function() {
			this.template( '_composer.json', 'composer.json' );
		},

		git: function() {
			this.copy( '_gitignore', '.gitignore' );
		},

		markdown: function() {
			this.copy( '_LICENSE.md', 'LICENSE.md' );
			this.template( '_README.md', 'README.md' );
		},

		tests: function() {
			this.copy( '_phpunit.xml.dist', 'phpunit.xml.dist' );
			this.copy( '_bootstrap.php.dist', 'bootstrap.php.dist' );
			this.template( '_TestCase.php', 'tests/test-tools/TestCase.php' );
		}
	}
);

/**
 * Install dependencies
 *
 * @param {string} command
 * @param {object} context
 *
 * @returns {Function}
 *
 * @private
 */
function _install( command, context ) {
	return function install( cb ) {
		context.emit( command + 'Install' );
		context.spawnCommand( command, ['install'] )
			.on( 'error', cb )
			.on( 'exit', context.emit.bind( context, command + 'Install:end' ))
			.on( 'exit', function ( err ) {
				     if ( err === 127 ) {
					     this.log.error( 'Could not find Composer' );
				     }
				     cb( err );
			     }.bind( context ));
	}
}

// Export the module
module.exports = LibGenerator;