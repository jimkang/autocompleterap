var wordDelimiters = /[ ":.,;!?#]/;

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
  return (wordsToExcludeInSuggestions.indexOf(word) !== -1);
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

function filterSuggestions(suggestions) {
  return suggestions.filter(function suggestionIsOK(text) {
    var wordsInText = text.split(wordDelimiters);
    return wordsInText.some(wordIsRequiredWord) && 
      wordsInText.every(wordIsOKInSuggestion);
  });
}

module.exports = filterSuggestions;
