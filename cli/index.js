/**
 * External dependencies
 */
var readline = require( 'readline'), // the main CLI engine
	colors = require( 'colors'), // makes stuff look nice
	_ = require( 'underscore' ); // always underscorejs.org

colors.setTheme({
	prompt: 'grey', // the prompter is grey
	bob: 'green', // our narrator and game master, bob, is green
	choice: 'cyan', // choices in a menu are blue
	commentary: 'italic', // comments on the current state of the game (eg, shuffling the cards)
	debug: 'rainbow'
});

/**
 * Internal dependencies
 */
var mainMenu = require( './mainMenu' );

var Cribbage_Cli = {

	interface: null,

	helpCommands: [
		{
			command: 'H',
			readable: 'Help! I need to know what keys to press.'
		},
		{
			command: 'Q',
			readable: 'I\'m plum tuckahed. Let\'s call it a night.'
		},
		{
			command: 'Huh?',
			readable: 'Show me that last thing you said.'
		}
	],

	init: function() {
		this.interface = readline.createInterface( { input: process.stdin, output: process.stdout, terminal: false } );
		console.log( Cribbage_Cli.messages.welcome );
		this.interface.setPrompt( this.messages.prompt );
		mainMenu.init( this.interface );
		this.addListeners();
	},

	addListeners: function() {
		Cribbage_Cli.interface.on('close', Cribbage_Cli.listeners.close );
		Cribbage_Cli.interface.on('line', Cribbage_Cli.listeners.help );
	},

	messages : {
		help : function() {
			var helpMessage = 'You wanna know what keys are acceptable to press?'.bob;
			_.each( Cribbage_Cli.helpCommands, function( helpCommand ) {
				helpMessage = helpMessage + "\n\t" + helpCommand.command + ': ' + helpCommand.readable.choice;
			} );
			helpMessage = helpMessage + "\n";
			return helpMessage;
		},
		welcome: "\nWelcome on in bud! You ready for some crib? It's gonna be a skunkah!\nType in 'H' anytime for help.\n".bob,
		prompt: '>'.prompt
	},

	listeners: {
		close: function() {
			console.log( "\n\nThat was some wicked cribbage playin'. Take 'er easy buzzy!\n\n".green );
		},
		help: function( line ) {
			switch( line ) {
				case 'H':
					console.log( Cribbage_Cli.messages.help() );
					Cribbage_Cli.interface.prompt();
					break;
				case 'Q':
					Cribbage_Cli.interface.close();
					break;
				case 'Huh?':
					console.log( mainMenu.getCurrentPrompt() );
					Cribbage_Cli.interface.prompt();
					break;
				default:
					Cribbage_Cli.interface.prompt();
					break;
			}
		}
	}

};


module.exports = Cribbage_Cli;