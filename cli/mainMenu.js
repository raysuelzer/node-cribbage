/**
 * External dependencies
 */
var _ = require( 'underscore' );
/**
 * Internal dependencies
 */
var singlePlayer = require( './singlePlayer'),
	singleHand = require( './singleHand');

var Main_Menu = {

	game: false,
	games: {
		'sp': 'Single Player',
		'sh': 'Single Hand'
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
				case 'sp':
					Main_Menu.game = singlePlayer;
					break;
				default:
					Main_Menu.game = singleHand;
					break;
			}
			Main_Menu.game.event.on( 'gameEnd', Main_Menu.listeners.gameComplete );
			Main_Menu.removeListeners();
			Main_Menu.game.init( Main_Menu.interface );
		},
		gameComplete: function() {
			Main_Menu.game.event.removeListener( 'gameEnd', Main_Menu.listeners.gameComplete );
			Main_Menu.game = false;
			Main_Menu.addListeners();
			console.log( 'Welp, that was a good game. You wanna play again?'.bob );
			console.log( Main_Menu.currentPrompt );
		}
	}

}

module.exports = Main_Menu;