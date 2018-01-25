var wordDelimiters = /[ ":.,;!?#]/;
var queue = require('queue-async');

var wordsToExcludeInSuggestions = [
  'definition',
  'définition',
  'difference',
  'android',
  'pronunciation',
  'meaning',
  'synonym',
  'synonyms',
  'antonym',
  'antonyms'
];

function wordIsInExcludedWords(word) {
  return wordsToExcludeInSuggestions.indexOf(word) !== -1;
}

function wordIsLongEnough(word) {
  return word && word.length > 2;
}

function wordIsOKInSuggestion(word) {
  return wordIsLongEnough(word) && !wordIsInExcludedWords(word);
}

function wordIsRequiredWord(word) {
  return word === 'and';
}

function filterSuggestionsSync(suggestions) {
  return suggestions.filter(function suggestionIsOK(text) {
    var wordsInText = text.split(wordDelimiters);
    return (
      wordsInText.some(wordIsRequiredWord) &&
      wordsInText.every(wordIsOKInSuggestion)
    );
  });
}

function filterSuggestions(opts, done) {
  var suggestionsFilteredInitially = filterSuggestionsSync(opts.suggestions);

  var q = queue();
  suggestionsFilteredInitially.forEach(function queueNounLookup(suggestion) {
    q.defer(opts.nounfinder.getNounsFromText, suggestion);
  });
  q.awaitAll(function checkNouns(error, arrayOfArraysOfNouns) {
    if (error) {
      done(error);
    } else {
      var suggestionsFilteredForNouns = [];

      for (var i = 0; i < arrayOfArraysOfNouns.length; ++i) {
        var suggestion = suggestionsFilteredInitially[i];
        var nounsInSuggestion = arrayOfArraysOfNouns[i];

        if (nounsInSuggestion.length > 1) {
          suggestionsFilteredForNouns.push(suggestion);
        } else {
          console.log('Filtering out:', suggestion);
        }
      }
      done(error, suggestionsFilteredForNouns);
    }
  });
}

module.exports = filterSuggestions;
