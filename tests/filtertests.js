var test = require('tape');
var filterSuggestions = require('../filtersuggestions');

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
    'pro-choicers hail satan'
  ];

  var expectedSuggestions = [
    'hypocenter and epicenter',
    'application and typist'
  ];

  t.deepEqual(filterSuggestions(rawSuggestions), expectedSuggestions);
});
