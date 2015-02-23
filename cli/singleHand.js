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
		this.game.event.once('discardInit', this.listeners.discardInit );
		this.game.event.once('playerDiscardComplete', this.listeners.playerDiscardComplete );
		this.game.event.once('playerDiscard', this.listeners.playerDiscard );
		this.game.event.once('gameComplete', this.listeners.gameComplete );
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
		discardInit: function() {
			var dealer = Cli_Single_Hand.game.players[ Cli_Single_Hand.game.dealerIndex ],
				whosCrib = Cli_Single_Hand.whosCrib( 'bobsPOV' );

			console.log( "\nOkay, I dropped 2 cards into %s crib. Now you gotta do the same.".bob, whosCrib );
			Cli_Single_Hand.interface.on( 'line', Cli_Single_Hand.listeners.discardPrompt );
			Cli_Single_Hand.discardSelect( '2 cards' );
		},
		discardPrompt: function(line) {
			var hand = Cli_Single_Hand.game.players[ Cli_Single_Hand.game.discardIndex ].hand,
				index = parseInt( line ) - 1;
			if ( index in hand ) {
				Cli_Single_Hand.game.playerDiscard( index );
			}
		},
		playerDiscard: function() {
			console.log( "There's 1, now let's pick one more.".bob );
			Cli_Single_Hand.discardSelect( '1 card' );
		},
		playerDiscardComplete: function() {
			Cli_Single_Hand.interface.removeListener( 'line', Cli_Single_Hand.listeners.discardPrompt );
			Cli_Single_Hand.game.setCutCard();
		},
		gameComplete: function() {
			var cutCard = Cli_Single_Hand.game.cutCard,
				bob = Cli_Single_Hand.game.playerIndexWhere( 'isRobot', true ),
				you = Cli_Single_Hand.game.playerIndexWhere( 'isRobot', false ),
				bobsHand = Cli_Single_Hand.game.players[bob].hand,
				yourHand = Cli_Single_Hand.game.players[you].hand,
				cribHand = Cli_Single_Hand.game.crib;

			console.log( "\nCut card: %s %s\n".prompt, cutCard.suitsymbol, cutCard.name );

			if ( bob === Cli_Single_Hand.game.dealerIndex ) {
				console.log( "\nYour Hand: %s".prompt, Cli_Single_Hand.displayHand( yourHand ) );
				console.log( "\nBob's Hand: %s".prompt, Cli_Single_Hand.displayHand( bobsHand ) );
				console.log( "\nBob's Crib: %s".prompt, Cli_Single_Hand.displayHand( cribHand ) );
			} else {
				console.log( "\nBob's Hand: %s".prompt, Cli_Single_Hand.displayHand( bobsHand ) );
				console.log( "\nYour Hand: %s".prompt, Cli_Single_Hand.displayHand( yourHand ) );
				console.log( "\nYour Crib: %s".prompt, Cli_Single_Hand.displayHand( cribHand ) );
			}

			Cli_Single_Hand.event.emit( 'gameComplete' );

		}
	},

	whosCrib: function( context ) {
		var dealer = Cli_Single_Hand.game.players[ Cli_Single_Hand.game.dealerIndex],
			who;
		switch( context ) {
			case 'bobsPOV':
				who = ( dealer.isRobot ) ? "my" : 'your';
				break;
			default:
				who = ( dealer.isRobot ) ? "Bob's" : 'your';
		}
		return who;
	},

	discardSelect: function( num ) {
		var whosCrib = Cli_Single_Hand.whosCrib(),
			message = "\nPlease select " + num + " to add to " + whosCrib + " crib.",
			hand = Cli_Single_Hand.game.players[ Cli_Single_Hand.game.discardIndex ].hand;

		message = message + Cli_Single_Hand.displayHand( hand );
		Cli_Single_Hand.currentPrompt = message.prompt.commentary;
		console.log( Cli_Single_Hand.currentPrompt );
	},

	displayHand: function( hand ) {
		var message = '';
		for( var i = 0; i < hand.length; i++ ) {
			message = message + "\n\t" + ( i + 1 ) + ": " + hand[i].suitsymbol + " " + hand[i].name;
		}
		return message;
	}

};

module.exports = Cli_Single_Hand;