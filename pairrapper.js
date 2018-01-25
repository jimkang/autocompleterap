var sprintf = require('sprintf-js').sprintf;
var callNextTick = require('call-next-tick');
var filterSuggestions = require('./filtersuggestions');
var config = require('./config');
var createNounfinder = require('nounfinder');

function createPairRapper(opts) {
  if (!opts || !opts.wordnok || !opts.autocompl || !opts.probable) {
    throw new Error('Missing required opt.');
  }

  var wordnok = opts.wordnok;
  var autocompl = opts.autocompl;
  var probable = opts.probable;
  var logger = console;
  if (opts.logger) {
    logger = opts.logger;
  }

  var nounfinder = createNounfinder({
    wordnikAPIKey: config.wordnikAPIKey
  });

  function getPairRap(rapOpts, done) {
    if (!rapOpts || !rapOpts.template) {
      throw new Error('Missing required opt. Opts: ' + JSON.stringify(rapOpts));
    }

    wordnok.getTopic(getAutocompleteSuggestionsForTopic);

    function getAutocompleteSuggestionsForTopic(error, topic) {
      if (error) {
        done(error);
        return;
      }

      logger.log('Topic:', topic);

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

        filterSuggestions(
          {
            suggestions: suggestions,
            nounfinder: nounfinder
          },
          function useFilteredSuggestions(error, filteredSuggestions) {
            var noSuggestions =
              !filteredSuggestions || filteredSuggestions.length < 1;
            if (error || noSuggestions) {
              // Start over.
              if (error) {
                logger.log(error);
              }
              if (noSuggestions) {
                logger.log('Got no suggestions for', topic, '. Trying again.');
              }
              callNextTick(
                wordnok.getTopic,
                getAutocompleteSuggestionsForTopic
              );
              return;
            }

            var suggestion = pickSuggestionFromSuggestions(filteredSuggestions);
            suggestion = formatSuggestion(suggestion);
            var rap = capitalizeFirst(sprintf(rapOpts.template, suggestion));
            var formattedRap = formatRap(rap);
            if (formattedRap.length > 140) {
              done(new Error('Generated rap is too long'), formattedRap);
            } else {
              done(null, formattedRap);
            }
          }
        );
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
      var rank = suggestions.length - i;
      probabilityMapping[suggestion] = rank * rank;
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
