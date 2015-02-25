/**
 * External Dependencies
 */
var _ = require( 'underscore' );
/**
 * Internal Dependencies
 */
var scoringIndexes = require( './scoringIndexes'),
	deckOfCards = require( './deckOfCards' );

var cribbage = {

	score: {},

	scoreReset: function() {
		this.score = {};
	},

	calculateScore : function( hand, cutCard ) {
		this.scoreReset();
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
			rightSuit = cutCard.suit,
			numJacks = 0;

		if ( ! jacks ) {
			return numJacks;
		}

		_.each( jacks, function( jack ) {
			if ( jack.suit == rightSuit ) {
				numJacks++;
			}
		});
		return numJacks;
	},

	calculateFlush : function( hand, cutCard ) {
		var numCards,
			values,
			scoring;

		values = _.pluck( hand, 'suitvalue' );

		if ( cutCard ) {
			values.push( cutCard.suitvalue );
		}
		numCards = values.length;

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
			scoring;

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

			var sequence = indexes[i],
				sequenceRun = 0;

			for( var vi = 0; vi < sequence.length; vi++ ) {
				if ( ! current ) {
					sequenceRun = 1;
					current = values[ sequence[vi] ];
				} else if ( current + 1 == values[ sequence[vi] ] ) {
					sequenceRun++;
					current = values[ sequence[vi] ];
				}
			}

			if ( sequenceRun === sequence.length ) {
				run = run + sequenceRun;
			}

			current = false;

		}

		return run;

	},

	isFlush: function( indexes, values ) {

		var flush = 0,
			current = false;

		for( var i = 0; i < indexes.length; i++ ) {

			var sequence = indexes[i],
				sequenceFlush;

			for( var vi = 0; vi < sequence.length; vi++ ) {
				if ( ! current ) {
					sequenceFlush = 1;
					current = values[ sequence[vi] ];
				} else if ( current == values[ sequence[vi] ] ) {
					sequenceFlush++;
					current = values[sequence[vi]];
				}
			}

			if ( sequenceFlush === sequence.length ) {
				flush = sequenceFlush;
			}

			current = false;

		}

		return flush;

	},

	intel: {
		discard: function( hand ) {
			var discardIndexes = scoringIndexes.discards,
				intel = [],
				deck = cribbage.intel.getDeck( hand );
			for( var i = 0; i < discardIndexes.length; i++ ) {
				var discards = [],
					discardIndex = discardIndexes[i],
					tempHand = hand.slice(0),
					score,
					intelObject={},
					potential;
				discards.push( tempHand.splice( discardIndex[0], 1 ) );
				discards.push( tempHand.splice( discardIndex[1], 1 ) );
				score = cribbage.calculateScore( tempHand, false );

				intelObject = {
					hand: tempHand,
					discards: discards,
					score: score.total
				};
				intel.push( intelObject );
			}
			return intel;
		},

		getDeck: function( hand ) {
			var fullDeck = deckOfCards.get(),
				mappedHand,
				trueDeck;

			mappedHand = _.map( hand, function( card ) {
				return card.name + ":" + card.suitvalue;
			});
			trueDeck = _.reject( fullDeck, function( card ) {
				return  _.contains( mappedHand, card.name + ":" + card.suitvalue );
			});

			return trueDeck;

		}

	}

};

module.exports = cribbage;