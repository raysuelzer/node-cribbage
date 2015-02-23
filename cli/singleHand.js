/**
 * External dependencies
 */
var events = require('events'),
	_ = require( 'underscore' );

/**
 * Internal dependecies
 */
var singleHand = require( '../games/singleHand' );

var Cli_Single_Hand = {
	interface: false,
	currentPrompt: false,
	event: new events.EventEmitter(),
	game: singleHand,

	init: function( interface ) {
		this.interface = interface;
		this.game.event.once('cardsShuffled', this.listeners.welcome );
		this.game.event.once('playersSet', this.listeners.firstDeal );
		this.game.event.once('dealingOrderSet', this.listeners.dealingOrderSet );
		this.game.event.once('dealComplete', this.listeners.dealComplete );
		this.game.event.once('discard', this.listeners.discard );
		this.game.start();
	},

	listeners: {
		welcome: function() {
			console.log( "\nOkay, Let's play one hand. Me versus you.\n".bob );
			console.log( "\nShuffling the cards.\n".commentary.prompt );
		},
		firstDeal: function() {
			console.log(  "\nCutting the cards to determine first deal.".commentary.prompt );
			Cli_Single_Hand.game.firstDeal();
		},
		dealingOrderSet: function() {
			var bob = _.findWhere( Cli_Single_Hand.game.players, { isRobot: true } ),
				you = _.findWhere( Cli_Single_Hand.game.players, { isRobot: false } );
			console.log(
				"You got a %s of %s, and Bob got a %s of %s".commentary.prompt,
				you.dealingCard.name,
				you.dealingCard.suitsymbol,
				bob.dealingCard.name,
				bob.dealingCard.suitsymbol
			);

			if ( bob.dealingOrder > you.dealingOrder ) {
				console.log( 'Bob is the dealer.'.commentary.prompt );
				console.log( "\nMy crib!\n".bob );
				console.log( 'Bob is dealing'.commentary.prompt );
			} else {
				console.log( 'You are the dealer.'.commentary.prompt );
				console.log( "\nYour crib!\n".bob );
				console.log( 'You are dealing'.commentary.prompt );
			}
			Cli_Single_Hand.game.dealCards();
		},
		dealComplete: function() {
		},
		discard: function() {
			console.log(  Cli_Single_Hand.game.players );
		}
	}

};

module.exports = Cli_Single_Hand;