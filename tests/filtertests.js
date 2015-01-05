var test = require('tape');
var filterSuggestions = require('../filtersuggestions');

test('Filter words that indicate boring suggestions', function testBoring(t) {
  t.plan(1);

  var rawSuggestions = [
    'electuaries and definition',
    'electuaries definitional',
    'electuaries drug',
    'hypocenter and epicenter difference',
    'hypocenter and epicenter',
    'netter and android app'
  ];

  var expectedSuggestions = [
    'electuaries definitional',
    'electuaries drug',
    'hypocenter and epicenter'
  ];

  t.deepEqual(filterSuggestions(rawSuggestions), expectedSuggestions);
});
