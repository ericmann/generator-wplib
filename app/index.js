'use strict';

var yeoman = require('yeoman-generator'),
	chalk = require('chalk'),
	path = require('path');

var LibGenerator = yeoman.generators.Base.extend({
	constructor: function() {
		yeoman.generators.Base.apply( this, arguments );
		var dirPath = '../templates';
		this.sourceRoot( path.join( __dirname, dirPath ) );
	},

	init: function() {
		this.pkg = require('../package.json');

		this.on( 'end', function() {

		} );
	},

	welcome: function() {
		this.log( chalk.magenta( 'Thanks for generating a WordPress library with yo!' ) );
	}

	// Prompts

	// Output
});

// Export the module
module.exports = Generator;