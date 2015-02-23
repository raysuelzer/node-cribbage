/**
 * External dependencies
 */
var events = require('events'),
	_ = require( 'underscore' );

/**
 * Internal Dependencies
 */
var game = require( './index'),
	deck = require( '../lib/deckOfCards'),
	cribbage = require( '../lib/cribbage' );

var Single_Hand = {
	engines: {
		cribbage: cribbage,
		deck: deck
	},
	deck: false,
	event: new events.EventEmitter(),
	numPlayers:2,
	cardsPerDeal:6,
	players: [],

	start: function() {
		this.shuffle();
		// adds an robot player
		this.players.push( this.player( { isRobot: true } ) );
		// adds a human player
		this.players.push( this.player( { isRobot: false } ) );
		this.event.emit( 'playersSet' );
		this.event.on( 'cutCardSet', this.gameComplete );
	},

	gameComplete: function() {
		Game.event.emit( 'gameComplete' );
		Game.players = [];
		Game.gameReset();
	}
};

var Game = _.extend( game, Single_Hand );

module.exports = Game;