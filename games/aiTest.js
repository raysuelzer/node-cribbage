/**
 * External dependencies
 */
var _ = require( 'underscore' );

/**
 * Internal Dependencies
 */
var game = require( './index');

var ai_Test = {
	numPlayers:1,
	cardsPerDeal:6,

	start: function() {
		this.gameReset();
		this.shuffle();
		// adds an robot player
		this.players.push( this.player( { isRobot: true } ) );
		this.event.emit( 'playersSet' );
	}
};

var Game = _.extend( game, ai_Test );

module.exports = Game;