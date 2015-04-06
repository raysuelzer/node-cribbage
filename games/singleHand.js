/**
 * External dependencies
 */
var _ = require( 'underscore' );

/**
 * Internal Dependencies
 */
var game = require( './index');

var Single_Hand = {
	numPlayers:2,
	cardsPerDeal:6,

	start: function() {
		this.gameReset();
		this.shuffle();
		// adds an robot player
		this.players.push( this.player( { isRobot: true } ) );
		// adds a human player
		this.players.push( this.player( { isRobot: false } ) );
		this.event.emit( 'playersSet' );
		this.event.on( 'cutCardSet', this.gameComplete );
	},

	/**
	 * each player can get up to 2 points in their tally
	 * if player0's tally is higher than player[1]'s tally, player[0] wins, and vice versa
	 * it's a draw if the tallies are equal
	 */
	getWinner: function() {

		var tally = [ 0, 0];

		// compare the main hands
		if ( Game.players[0].score.total > Game.players[1].score.total ) {
			tally[0]++;
		} else if ( Game.players[0].score.total < Game.players[1].score.total ) {
			tally[1]++;
		}

		// compare the crib hands
		// player[0] is the dealer
		if ( 0 === Game.dealerIndex ) {
			if ( Game.cribScore.total > Game.players[1].score.total ) {
				tally[0]++;
			} else if ( Game.cribScore.total < Game.players[1].score.total ) {
				tally[1]++;
			}
		// player[1] is the dealer
		} else {
			if ( Game.cribScore.total > Game.players[0].score.total ) {
				tally[1]++;
			} else if ( Game.cribScore.total < Game.players[0].score.total ) {
				tally[0]++;
			}
		}

		if ( tally[0] > tally[1] ) {
			return 0;
		} else if ( tally[0] < tally[1] ) {
			return 1;
		} else {
			return false;
		}
	},

	gameComplete: function() {
		_.each( Game.players, function( player, index ) {
			Game.players[index].score = Game.engines.cribbage.calculateScore( player.hand, Game.cutCard );
		} );
		Game.cribScore = Game.engines.cribbage.calculateScore( Game.crib, Game.cutCard );
		Game.winnerIndex = Game.getWinner();
		Game.event.emit( 'gameComplete' );
	}
};

var Game = _.extend( game, Single_Hand );

module.exports = Game;