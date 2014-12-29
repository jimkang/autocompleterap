var sprintf = require('sprintf-js').sprintf;
var conformAsync = require('conform-async');

function createPairRapper(opts) {
  if (!opts || !opts.wordnok || !opts.autocompl || !opts.probable) {
    throw new Error('Missing required opt.');
  }

  var wordnok = opts.wordnok;
  var autocompl = opts.autocompl;
  var probable = opts.probable;

  function getPairRap(rapOpts, done) {
    if (!rapOpts || !rapOpts.template) {
      throw new Error('Missing required opt.');
    }

    wordnok.getTopic(getAutocompleteSuggestionsForTopic);

    function getAutocompleteSuggestionsForTopic(error, topic) {
      if (error) {
        done(error);
        return;
      }

      autocompl(topic + ' and', makeRapFromTopicAndSuggestions);

      function makeRapFromTopicAndSuggestions(error, suggestions) {
        if (error) {
          done(error);
          return;
        }

        if (Array.isArray(suggestions)) {
          suggestions = suggestions.map(function trimString(s) {
            return s.trim();
          });
        }

        if (!suggestions || suggestions.length < 1) {
          // Start over.
          console.log('Got no suggestions for', topic, '. Trying again.');
          conformAsync.callBackOnNextTick(
            wordnok.getTopic, getAutocompleteSuggestionsForTopic
          );
          return;
        }

        var suggestion = pickSuggestionFromSuggestions(suggestions);
        suggestion = formatSuggestion(suggestion);
        var rap = capitalizeFirst(sprintf(rapOpts.template, suggestion));
        done(error, formatRap(rap));
      }
    }
  }

  function capitalizeFirst(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  }

  function formatRap(rap) {
    var lines = rap.split(' / ');
    var capitalizedLines = lines.map(capitalizeFirst);
    return capitalizedLines.join('\n');
  }

  function pickSuggestionFromSuggestions(suggestions) {
    var probabilityMapping = {};
    // Weight the earlier suggestions higher.
    suggestions.forEach(function addSuggestion(suggestion, i) {
      probabilityMapping[suggestion] = suggestions.length - i;
    });
    // console.log(probabilityMapping);

    var table = probable.createRangeTableFromDict(probabilityMapping);
    return table.roll();
  }

  function formatSuggestion(suggestion) {
    if (suggestion.indexOf(' and ') === -1) {
      suggestion = suggestion.replace(' ', ' and ');
    }
    return suggestion.trim();
  }

  return {
    getPairRap: getPairRap
  };
}

module.exports = createPairRapper;
