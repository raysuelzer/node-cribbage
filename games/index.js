/**
 * External dependencies
 */
var events = require('events'),
	_ = require( 'underscore' );

var Game = {

	dealer: false,
	deal: false,

	dealCards: function() {
		var dealt = [];

		Game.shuffle();

		for( var i = 0; i < Game.cardsPerDeal; i++ ) {
			Game.iteratePlayer( 'deal' );

			while( ! _.contains( dealt, Game.deal ) ) {
				Game.players[ Game.deal ].hand.push( Game.deck.shift() );
				dealt.push( Game.deal );
				Game.iteratePlayer( 'deal' );
			}

			dealt = [];

		}

		Game.event.emit( 'dealComplete' );
		Game.discard();

	},

	discard: function() {
		for( var i = 0; i < Game.numPlayers; i++ ) {
			if ( Game.players[ i ].isRobot ) {
				Game.AI.discard( i );
			}
		}
		Game.event.emit( 'discard' );
	},

	/**
	 * This iterates through players.
	 * Used with 'dealer' to set the next dealer
	 * Used with 'deal' to set who gets the next card during a deal
	 *
	 * @param prop ( 'deal' or 'dealer' )
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

	setDealer : function() {
		// this sets the first dealer
		Game.iteratePlayer( 'dealer' );
		// sets the deal pointer at the dealer, it will move to next player during deal()
		Game.deal = Game.dealer;
		Game.event.emit( 'dealerSet' );
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
		Game.players.reverse();
		Game.setDealer();

		this.event.emit( 'dealingOrderSet' );
	},

	/**
	 * Resets and shuffles the deck
	 */
	shuffle: function() {
		this.deck = this.engines.deck.get();
		this.event.emit( 'cardsShuffled' );
	},

	AI: {
		discard: function( playerIndex ) {
			Game.players[ playerIndex ].hand.shift();
			Game.players[ playerIndex ].hand.shift();
		}
	},

	player: function( props ) {
		var defaults = {
			isRobot: false,
			hand: [],
			dealer: false
		};

		return _.extend( defaults, props );
	}

};

module.exports = Game;