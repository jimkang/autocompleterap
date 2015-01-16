var test = require('tape');
var filterSuggestions = require('../filtersuggestions');
var conformAsync = require('conform-async');
var createNounfinder = require('nounfinder');
var config = require('../config');

test('Filter words that indicate boring suggestions', function testBoring(t) {
  t.plan(1);

  var rawSuggestions = [
    'electuaries and definition',
    'electuaries definitional',
    'electuaries définition',
    'electuaries drug',
    'hypocenter and epicenter difference',
    'hypocenter and epicenter',
    'netter and android app',
    'butts pronunciation',
    'defenestration meaning',
    'ap typist',
    'application and typist',
    'dejection and synonyms',
    'dejection and synonym',
    'dejection rejection',
    'dejection antonym',
    'pro-choicers hail satan',
    'asynchronous and synchronous',
    'hardboiled and high heeled'
  ];

  var nounsInSuggestions = [
    ['electuaries', 'definition'],
    ['electuaries'],
    ['electuaries', 'définition'],
    ['electuaries', 'drug'],
    ['hypocenter', 'epicenter', 'difference'],
    ['hypocenter', 'epicenter'],
    ['netter', 'android', 'app'],
    ['butts', 'pronunciation'],
    ['defenestration', 'meaning'],
    ['ap', 'typist'],
    ['application', 'typist'],
    ['dejection', 'synonyms'],
    ['dejection', 'synonym'],
    ['dejection', 'rejection'],
    ['dejection', 'antonym'],
    ['pro-choicers', 'hail', 'satan'],
    [],
    []
  ];

  var expectedSuggestions = [
    'hypocenter and epicenter',
    'application and typist'
  ];

  filterSuggestions(
    {
      suggestions: rawSuggestions, 
      nounfinder: {
        getNounsFromText: function mockGetNounsFromText(text, done) {
          var nouns = nounsInSuggestions[rawSuggestions.indexOf(text)];
          conformAsync.callBackOnNextTick(done, null, nouns);
        }
      }
      // createNounfinder({
      //   wordnikAPIKey: config.wordnikAPIKey
      // });
    },
    function done(error, filtered) {
      t.deepEqual(filtered, expectedSuggestions);
    }
  );
});
