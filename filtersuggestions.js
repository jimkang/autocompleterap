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

function wordIsLongEnough(word) {
  return word && word.length > 2;
}

function wordIsOKInSuggestion(word) {
  return wordIsLongEnough(word) && !wordIsInExcludedWords(word);
}

function filterSuggestions(suggestions) {
  return suggestions.filter(function textContainsExcludedWord(text) {
    var wordsInText = text.split(wordDelimiters);
    return wordsInText.every(wordIsOKInSuggestion);
  });
}

module.exports = filterSuggestions;
