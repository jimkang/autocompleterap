var test = require('tape');
var callNextTick = require('call-next-tick');
var createPairRapper = require('../pairrapper');

var mockWordnok = {
  getTopic: function mockGetTopic(done) {
    callNextTick(done, null, 'peanut butter');
  }
};


var mockProbable = {
  createRangeTableFromDict: function mockCreateRangeTableFromDict(dict) {
    return {
      roll: function mockRoll() {
        return 'peanut butter and chocolate';
      }
    };
  }
};

test('Basic test', function basicTest(t) {
  t.plan(2);

  var pairRapper = createPairRapper({
    wordnok: mockWordnok,
    autocompl: function mockAutocompl(partialSearchTerm, done) {
      var results = [];

      if (partialSearchTerm === 'peanut butter and') {
        results = [
          'peanut butter and jelly',
          'peanut butter and jelly dance',
          'peanut butter and chocolate'
        ];
      }

      callNextTick(done, null, results);
    },
    probable: mockProbable
  });

  pairRapper.getPairRap(
    {
      template: '%s, yeah I\'m fucked up now',
    },
    function checkRap(error, rap) {
      t.ok(!error, 'Shouldn\'t get error.');
      t.equal(rap, 'Peanut butter and chocolate, yeah I\'m fucked up now');
    }
  );
});

test('Trying again if there\'s no suggestions', function tryAgainTest(t) {
  t.plan(2);

  autocomplCallCount = 0;

  var pairRapper = createPairRapper({
    wordnok: mockWordnok,
    autocompl: function mockAutocompl(partialSearchTerm, done) {
      var results = [];
      // Returns no results the first two times.    
      if (autocomplCallCount > 1 && partialSearchTerm === 'peanut butter and') {
        results = [
          'peanut butter and jelly',
          'peanut butter and jelly dance',
          'peanut butter and chocolate'
        ];
      }

      autocomplCallCount += 1;
      callNextTick(done, null, results);
    },
    probable: mockProbable
  });

  pairRapper.getPairRap(
    {
      template: '%s, yeah I\'m fucked up now',
    },
    function checkRap(error, rap) {
      t.ok(!error, 'Shouldn\'t get error.');
      t.equal(rap, 'Peanut butter and chocolate, yeah I\'m fucked up now');
    }
  );
});


test('Error for too long raps', function tooLongTest(t) {
  t.plan(2);

  var pairRapper = createPairRapper({
    wordnok: mockWordnok,
    autocompl: function mockAutocompl(partialSearchTerm, done) {
      var results = [];

      if (partialSearchTerm === 'peanut butter and') {
        results = [
          'peanut butter and jelly',
          'peanut butter and jelly dance',
          'peanut butter and chocolate'
        ];
      }

      callNextTick(done, null, results);
    },
    probable: mockProbable
  });

  pairRapper.getPairRap(
    {
      template: '%s together, now you know you in trouble / ' +
        'Ain\'t nothing but a G thang, baby / ' +
        'Two loc\'ed out niggas goin\' crazy / ' +
        'Death Row is the label that pays me / ' +
        'Unfadeable so please don\'t try to fade this'
    },
    function checkRap(error, rap) {
      t.ok(error, 'Should get error.');
      t.equal(error.message, 'Generated rap is too long', 
        'Should get "too long" error message.'
      );
    }
  );
});

test('Formatting', function formattingTest(t) {
  t.plan(2);

  var pairRapper = createPairRapper({
    wordnok: mockWordnok,
    autocompl: function mockAutocompl(partialSearchTerm, done) {
      var results = [];

      if (partialSearchTerm === 'peanut butter and') {
        results = [
          'peanut butter and jelly',
          'peanut butter and jelly dance',
          ' peanut butter and chocolate'
        ];
      }

      callNextTick(done, null, results);
    },
    probable: mockProbable
  });

  pairRapper.getPairRap(
    {
      template: 'give me the microphone first so I can bust like a bubble / %s together, now you know you in trouble',
    },
    function checkRap(error, rap) {
      t.ok(!error, 'Shouldn\'t get error.');
      t.equal(
        rap, 
        'Give me the microphone first so I can bust like a bubble\n' + 
        'Peanut butter and chocolate together, now you know you in trouble'
      );
    }
  );
});
