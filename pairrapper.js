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

        if (!suggestions || suggestions.length < 1) {
          // Start over.
          console.log('Got no suggestions for', topic, '. Trying again.');
          conformAsync.callBackOnNextTick(
            wordnok.getTopic, getAutocompleteSuggestionsForTopic
          );
          return;
        }

        var suggestion = probable.pickFromArray(suggestions);
        var complement = getComplementFromSuggestion(topic, suggestion);
        var rap = capitalizeFirst(sprintf(rapOpts.template, topic, complement));
        done(error, rap);
      }
    }
  }

  function getComplementFromSuggestion(topic, suggestion) {
    // 5 is the length of ' and '.
    return suggestion.substr(topic.length + 5);
  }

  function capitalizeFirst(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  }

  return {
    getPairRap: getPairRap
  };
}

module.exports = createPairRapper;
