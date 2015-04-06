/**
 * External dependencies
 */
var events = require('events'),
	_ = require( 'underscore' );

/**
 * Internal dependencies
 */

var deck = require( '../lib/deckOfCards'),
	cribbage = require( '../lib/cribbage' );

var Game = {

	event: new events.EventEmitter(),
	dealerIndex: false,
	dealIndex: false,
	discardIndex: false,
	crib: [],
	cribScore: false,
	cutCard: false,
	deck: false,
	players: [],
	winnerIndex: false,
	engines: {
		cribbage: cribbage,
		deck: deck
	},

	dealCards: function() {
		var dealt = [];

		Game.shuffle();

		for( var i = 0; i < Game.cardsPerDeal; i++ ) {
			Game.iteratePlayer( 'dealIndex' );

			while( ! _.contains( dealt, Game.dealIndex ) ) {
				Game.players[ Game.dealIndex ].hand.push( Game.deck.shift() );
				dealt.push( Game.dealIndex );
				Game.iteratePlayer( 'dealIndex' );
			}

			dealt = [];

		}

		Game.event.emit( 'dealComplete' );
		Game.discardInit();

	},

	discardInit: function() {
		for( var i = 0; i < Game.numPlayers; i++ ) {
			if ( Game.players[ i ].isRobot ) {
				Game.AI.discard( i );
			}
		}
		Game.discardIndex = Game.playerIndexWhere( 'isRobot', false );
		Game.event.emit( 'discardInit' );
	},

	playerDiscard: function( index ) {
		Game.crib.push( Game.players[Game.discardIndex].hand[index] );
		Game.players[Game.discardIndex].hand.splice( index, 1 );
		if ( Game.players[Game.discardIndex].hand.length === 4 ) {
			Game.event.emit( 'playerDiscardComplete' );
		} else {
			Game.event.emit( 'playerDiscard' );
		}
	},

	/**
	 * This iterates through players.
	 * Used with 'dealerIndex' to set the next dealer
	 * Used with 'dealIndex' to set who gets the next card during a deal
	 *
	 * @param prop ( 'dealIndex' or 'dealerIndex' )
	 */
	iteratePlayer: function( prop ) {

		if ( Game[ prop ] === false ) {
			Game[ prop ] = 0;
		} else {
			Game[ prop ]++;
		}

		if ( Game[ prop ] == Game.numPlayers ) {
			Game[ prop ] = 0;
		}

	},

	/**
	 * Deals each player one card to determine play order ( highest card plays first, followed by 2nd highest, etc )
	 * @uses iteratePlayer to set the first dealer
	 */
	firstDeal : function() {

		_.each( Game.players, function( player ) {
			var card = Game.deck.shift(),
				dealingOrder = card.value + ( card.suitvalue / 10 );
			player.dealingCard = card;
			player.dealingOrder = dealingOrder;
		});
		Game.players = _.sortBy( Game.players, 'dealingOrder' );
		Game.dealIndex = Game.dealerIndex = 0;

		this.event.emit( 'dealingOrderSet' );
	},

	/**
	 * Resets and shuffles the deck
	 */
	shuffle: function() {
		Game.deck = Game.engines.deck.get();
		Game.event.emit( 'cardsShuffled' );
	},

	AI: {
		discard: function( playerIndex ) {
			Game.crib.push( Game.players[ playerIndex ].hand.shift() );
			Game.crib.push( Game.players[ playerIndex ].hand.shift() );
		}
	},

	player: function( props ) {
		var defaults = {
			isRobot: false,
			hand: []
		};

		return _.extend( defaults, props );
	},

	playerIndexWhere: function( attr, val ) {
		for( var i = 0; i < Game.numPlayers; i++ ) {
			if ( Game.players[i][attr] === val ) {
				return i;
			}
		}
		return false;
	},

	setCutCard: function() {
		Game.cutCard = _.sample( Game.deck );
		Game.event.emit( 'cutCardSet' );
	},

	gameReset: function() {
		Game.dealerIndex = false;
		Game.dealIndex = false;
		Game.discardIndex = false;
		Game.crib = [];
		Game.cutCard = false;
		Game.deck = false;
		Game.cribScore = false;
		Game.players = [];
		Game.winnerIndex = false;
	}

};

module.exports = Game;