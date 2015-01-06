var wordDelimiters = /[ ":.,;!?#]/;

var wordsToExcludeInSuggestions = [
  'definition',
  'définition',
  'difference',
  'android',
  'pronunciation',
  'meaning'
];

function wordIsInExcludedWords(word) {
  return (wordsToExcludeInSuggestions.indexOf(word) !== -1);
}

function filterSuggestions(suggestions) {
  return suggestions.filter(function textContainsExcludedWord(text) {
    var wordsInText = text.split(wordDelimiters);
    return !wordsInText.some(wordIsInExcludedWords);
  });
}

module.exports = filterSuggestions;
