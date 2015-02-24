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
		this.score.flush = this.calculateFlush( hand, cutCard );
		this.score.rightJack = 0;

		if ( cutCard ) {
			this.score.rightJack = this.isRightJack( hand, cutCard );
		}

		this.score.total = this.score.fifteens + this.score.pairs + this.score.runs + this.score.flush + this.score.rightJack;
		return this.score;
	},

	isRightJack: function( hand, cutCard) {
		var jacks = _.filter( hand, { name : 'Jack' } ),
			rightSuit = cutCard.suit;

		if ( ! jacks ) {
			return 0;
		}
		_.each( jacks, function( jack ) {
			if ( jack.suit === rightSuit ) {
				return 1;
			}
		});
		return 0;
	},

	calculateFlush : function( hand, cutCard ) {
		var numCards,
			values,
			scoring,
			flush = 0;

		values = _.pluck( hand, 'suitvalue' );

		if ( cutCard ) {
			values.push( cutCard.suitvalue );
		}
		numCards = values.length;
		values = _.sortBy( values );

		if ( numCards === 4 ) {
			scoring = scoringIndexes.flush.four;
		} else {
			scoring = scoringIndexes.flush.five;
		}

		for( var i = 0; i < scoring.length; i++ ) {
			var result = this.isFlush( scoring[ i ], values );
			if ( result > 0 ) {
				return result;
			}
		}

		return 0;
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

	},

	isFlush: function( indexes, values ) {

		var flush = 0,
			current = false;

		for( var i = 0; i < indexes.length; i++ ) {

			var sequence = indexes[ i ];

			for( var vi = 0; vi < sequence.length; vi++ ) {
				if ( ! current ) {
					flush = 1;
					current = values[ vi ];
				} else if ( current == values[ vi ] ) {
					flush++;
					current = values[ vi ];
				} else {
					current = false;
					break;
				}
			}

			if ( flush < 4 ) {
				flush = 0;
			}

			current = false;

		}

		return flush;

	}

};