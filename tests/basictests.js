var test = require('tape');
var conformAsync = require('conform-async');
var createPairRapper = require('../pairrapper');

var mockWordnok = {
  getTopic: function mockGetTopic(done) {
    conformAsync.callBackOnNextTick(done, null, 'peanut butter');
  }
};


var mockProbable = {
  pickFromArray: function mockPickFromArray(array) {
    return array[array.length - 1];
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

      conformAsync.callBackOnNextTick(done, null, results);
    },
    probable: mockProbable
  });

  pairRapper.getPairRap(
    {
      template: '%s and %s, yeah I\'m fucked up now',
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
      conformAsync.callBackOnNextTick(done, null, results);
    },
    probable: mockProbable
  });

  pairRapper.getPairRap(
    {
      template: '%s and %s, yeah I\'m fucked up now',
    },
    function checkRap(error, rap) {
      t.ok(!error, 'Shouldn\'t get error.');
      t.equal(rap, 'Peanut butter and chocolate, yeah I\'m fucked up now');
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
          'peanut butter and chocolate'
        ];
      }

      conformAsync.callBackOnNextTick(done, null, results);
    },
    probable: mockProbable
  });

  pairRapper.getPairRap(
    {
      template: 'give me the microphone first so I can bust like a bubble / %s and %s together, now you know you in trouble',
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
