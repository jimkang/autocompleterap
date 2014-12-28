var createPairRapper = require('./pairrapper');
var autocompl = require('autocompl');
var probable = require('probable');
var createWordnok = require('wordnok');
var config = require('./config');
var lineChomper = require('line-chomper');
var jsonfile = require('jsonfile');

var pairRapper = createPairRapper({
  wordnok: createWordnok({
    apiKey: config.wordnikAPIKey
  }),
  autocompl: autocompl,
  probable: probable
});

function getRapForTemplate(error, template) {
  if (error) {
    console.log(error);
  }
  else {
    pairRapper.getPairRap(
      {
        // template: '%s and %s, yeah I\'m fucked up now'
        template: template
      },
      postPairRap
    );
  }
}

function postPairRap(error, rap) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(rap);
  }
}

function getTemplate(done) {
  var templateOffsets = jsonfile.readFileSync('templatelineoffsets.json');
  var offsetToGet = probable.pickFromArray(templateOffsets);
  lineChomper.chomp(
    'templates.txt',
    {
      lineOffsets: templateOffsets,
      fromLine: offsetToGet.line,
      lineCount: 1
    },
    function readDone(error, lines) {
      if (error) {
        console.log(error);
      }
      else {
        done(error, lines[0]);
      }
    }
  );
}

getTemplate(getRapForTemplate);
