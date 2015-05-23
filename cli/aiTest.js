/**
 * External dependencies
 */
var events = require('events'),
	_ = require( 'underscore' ),
	aiTest = require( '../games/aiTest' );

var Cli_AI_Test = {
	event: new events.EventEmitter(),
	interface: false,
	currentPrompt: false,
	game: aiTest,

	init: function( interface ) {
		this.interface = interface;
		this.game.event.once( 'playersSet', this.listeners.playersSet );
		this.game.event.once( 'dealComplete', this.listeners.dealComplete );
		this.game.start();
	},

	listeners: {
		dealComplete: function() {
		},

		playersSet: function() {
			Cli_AI_Test.game.dealCards();
		}
	}
}

module.exports = Cli_AI_Test;