var c = require( './lib/cribbage' ),
	cutCard = {
		name: '9',
		value: 9,
		suit: 'Diamonds',
		suitvalue: 2,
		sequence: 9
	},
	hand = [
		{
			name: 'Jack',
			value: 10,
			suit: 'Clubs',
			suitvalue: 1,
			sequence: 11
		},
		{
			name: 'Jack',
			value: 10,
			suit: 'Diamonds',
			suitvalue: 2,
			sequence: 11
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
		},
		{
			name: '3',
			value: 3,
			suit: 'Diamonds',
			suitvalue: 2,
			sequence: 3
		},
		{
			name: '2',
			value: 2,
			suit: 'Diamonds',
			suitvalue: 2,
			sequence: 2
		},
	],
	intel = c.intel.discard( hand );

//console.log( intel );

