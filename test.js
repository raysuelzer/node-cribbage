var c = require( './lib/cribbage' ),
	cutCard = {
		name: '9',
		value: 9,
		suit: 'Diamonds',
		suitvalue: 2,
		sequence: 9,
	},
	hand = [
		{
			name: 'Jack',
			value: 10,
			suit: 'Clubs',
			suitvalue: 1,
			sequence: 11,
		},
		{
			name: 'Jack',
			value: 10,
			suit: 'Diamonds',
			suitvalue: 2,
			sequence: 11,
		},
		{
			name: '6',
			value: 6,
			suit: 'Clubs',
			suitvalue: 1,
			sequence: 6,
			suitsymbol: '♣'
		},
		{
			name: '6',
			value: 6,
			suit: 'Clubs',
			suitvalue: 1,
			sequence: 6
		}
	],
	score = c.calculateScore( hand, cutCard );

for( var i = 0; i < hand.length; i++ ) {
	console.log( hand[i].suit + ' ' + hand[i].name + "\n" );
}
console.log( "cut\n" + cutCard.suit + cutCard.name );
console.log( "\n", score );