/**
 * External Dependencies
 */
var _ = require( 'underscore' );
/**
 * Internal Dependencies
 */
var scoringIndexes = require( './scoringIndexes' );

module.exports = {

	score: {
		pairs: 0,
		fifteens: 0,
		runs: 0
	},

	calculateScore : function( hand, cutCard ) {
		this.score.fifteens = this.calculateFifteens( hand, cutCard );
		this.score.pairs = this.calculatePairs( hand, cutCard );
		this.score.runs = this.calculateRuns( hand, cutCard );
		return this.score;
	},

	calculateRuns : function( hand, cutCard ) {
		var numCards,
			values,
			scoring,
			runs = 0;

		values = _.pluck( hand, 'sequence' );

		if ( cutCard ) {
			values.push( cutCard.sequence );
		}
		numCards = values.length;
		values = _.sortBy( values );

		if ( numCards === 4 ) {
			scoring = scoringIndexes.runs.four;
		} else {
			scoring = scoringIndexes.runs.five;
		}

		for( var i = 0; i < scoring.length; i++ ) {
			var result = this.isRun( scoring[ i ], values );
			if ( result > 0 ) {
				return result;
			}
		}

		return 0;
	},

	calculatePairs: function( hand, cutCard ) {
		var numCards,
			values,
			scoring,
			pairs = 0;

		values = _.pluck( hand, 'name' );

		if ( cutCard ) {
			values.push( cutCard.name );
		}
		numCards = values.length;


		if ( numCards === 4 ) {
			scoring = scoringIndexes.pairs.four;
		} else {
			scoring = scoringIndexes.pairs.five;
		}

		for( var i = 0; i < scoring.length; i++ ) {
			pairs = pairs + this.isPair( scoring[ i ], values );
		}

		return pairs;
	},

	calculateFifteens: function( hand, cutCard ) {
		var numCards,
			values,
			scoring,
			fifteens = 0;

		values = _.pluck( hand, 'value' );
		if ( cutCard ) {
			values.push( cutCard.value );
		}
		numCards = values.length;

		if ( numCards === 4 ) {
			scoring = scoringIndexes.fifteens.four;
		} else {
			scoring = scoringIndexes.fifteens.five;
		}

		for( var i = 0; i < scoring.length; i++ ) {
			fifteens = fifteens + this.isFifteen( scoring[ i ], values );
		}

		return fifteens;
	},

	isFifteen : function( indexes, values ) {
		var t = 0;
		for( var i = 0; i < indexes.length; i++ ) {
			t = t + values[ indexes[ i ] ];
		}
		if ( t == 15 ) {
			return 2;
		}
		return 0;
	},

	isPair : function( indexes, values ) {
		var firstCard = indexes[0],
			secondeCard = indexes[1];
		if ( values[ firstCard ] === values[ secondeCard ] ) {
			return 2;
		}
		return 0;
	},

	isRun: function( indexes, values ) {

		var run = 0,
			current = false;

		for( var i = 0; i < indexes.length; i++ ) {

			var sequence = indexes[ i ];

			for( var vi = 0; vi < sequence.length; vi++ ) {
				if ( ! current ) {
					run = 1;
					current = values[ vi ];
				} else if ( current + 1 == values[ vi ] ) {
					run++;
					current = values[ vi ];
				} else {
					current = false;
					break;
				}
			}

			if ( run < 3 ) {
				run = 0;
			}

			current = false;

		}

		return run;

	}

};