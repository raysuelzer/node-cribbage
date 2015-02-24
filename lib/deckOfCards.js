/**
 * External Dependencies
 */
var _ = require( 'underscore' );

var Deck_of_Cards = {
	deck : [],

	/**
	 * Gets a shuffled array of card objects
	 * @returns {array of card objects}
	 */
	get: function() {
		this.deck = [];
		for( var s = 1; s <= 4; s++) {
			for( var n = 1; n <= 13; n++ ) {
				this.deck.push( this.card( n, s ) );
			}
		}
		this.deck = _.shuffle( this.deck );
		return this.deck;
	},

	/**
	 * Returns a card object
	 *
	 * @param value ( the numeric value of the card 1 - 13 )
	 * @param suitvalue ( the suit value of the card: clubs=1, diamonds=2, hearts=3, spades=4 )
	 * @returns {{name: *, value: *, suit: *, suitvalue: *, sequence: *}}
	 */
	card: function( value, suitvalue ) {

		var name, suit, sequence, suitsymbol;

		sequence = value;

		switch( value ) {
			case 1:
				name = 'Ace';
				break;
			case 11:
				name = 'Jack';
				value = 10;
				break;
			case 12:
				name = 'Queen';
				value = 10;
				break;
			case 13:
				name = 'King';
				value = 10;
				break;
			default :
				name = value.toString();
		}

		switch( suitvalue ) {
			case 1:
				suit = 'Clubs';
				suitsymbol = '♣';
				break;
			case 2:
				suit = 'Diamonds';
				suitsymbol = '♦';
				break;
			case 3:
				suit = 'Hearts';
				suitsymbol = '♥';
				break;
			default:
				suit = 'Spades';
				suitsymbol = '♠';
		}

		return {
			name: name,
			value: value,
			suit: suit,
			suitvalue: suitvalue,
			sequence: sequence,
			suitsymbol: suitsymbol
		};
	}

};

module.exports = Deck_of_Cards;