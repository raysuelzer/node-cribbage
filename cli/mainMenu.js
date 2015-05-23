/**
 * External dependencies
 */
var _ = require( 'underscore' );
/**
 * Internal dependencies
 */
var singleHand = require( './singleHand' ),
	aiTest = require( './aiTest' );

var Main_Menu = {

	game: false,
	games: {
		'sh': 'Single Hand',
		'ai': 'AI Tester'
	},
	currentPrompt : false,

	init: function( interface ) {
		this.interface = interface;
		this.addListeners();
		this.currentPrompt = this.messages.selectGame();
		console.log( this.currentPrompt );
		this.interface.prompt();
	},

	getCurrentPrompt: function() {
		if ( ! Main_Menu.game ) {
			return Main_Menu.currentPrompt;
		}
		return Main_Menu.game.currentPrompt;
	},

	addListeners: function() {
		Main_Menu.interface.on( 'line', Main_Menu.listeners.selectGame );
	},

	removeListeners: function() {
		Main_Menu.interface.removeListener( 'line', Main_Menu.listeners.selectGame );
	},

	messages: {
		selectGame : function() {
			var message = "\nWhatcha feel like playin'?".bob;
			_.each( Main_Menu.games, function( game, shortcut ){
				message = message + "\n\t" + shortcut + ": " + game.choice;
			});
			message = message + "\n";
			return message;
		}
	},

	listeners: {
		selectGame: function( line ) {
			if ( ! _.contains( _.keys( Main_Menu.games ), line ) ) {
				return;
			}
			switch( line ) {
				case 'ai':
					Main_Menu.game = aiTest;
					break;
				default:
					Main_Menu.game = singleHand;
					break;
			}
			Main_Menu.game.event.on( 'gameComplete', Main_Menu.listeners.gameComplete );
			Main_Menu.removeListeners();
			Main_Menu.game.init( Main_Menu.interface );
		},
		gameComplete: function() {
			Main_Menu.game.event.removeListener( 'gameComplete', Main_Menu.listeners.gameComplete );
			Main_Menu.game = false;
			Main_Menu.addListeners();
			console.log( "\nWelp, that was a good game. You wanna play again?\n".bob );
			console.log( Main_Menu.currentPrompt );
		}
	}

};

module.exports = Main_Menu;