var createPairRapper = require('./pairrapper');
var autocompl = require('autocompl');
var probable = require('probable');
var createWordnok = require('wordnok');
var config = require('./config');
var lineChomper = require('line-chomper');
var jsonfile = require('jsonfile');
var getReliableTemplate = require('./getreliabletemplate');
var Twit = require('twit');

var dryRun = false;

if (process.argv.length > 2) {
  dryRun = (process.argv[2].toLowerCase() == '--dry');
}

var pairRapper = createPairRapper({
  wordnok: createWordnok({
    apiKey: config.wordnikAPIKey
  }),
  autocompl: autocompl,
  probable: probable
});

var twit = new Twit(config.twitter);

function postRapForTemplate(error, template) {
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
    if (!dryRun) {
      twit.post(
        'statuses/update',
        {
          status: rap
        },
        function done(twitterError, data, response) {
          if (twitterError) {
            console.log(twitterError);
            console.log('data:', data);
          }
          else {
            console.log('Posted to Twitter.');
          }
        }
      );
    }
  }
}

function getUnvettedTemplate(done) {
  var templateOffsets = jsonfile.readFileSync(__dirname + '/templatelineoffsets.json');
  var offsetToGet = probable.pickFromArray(templateOffsets);
  lineChomper.chomp(
    __dirname + '/templates.txt',
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

if (probable.roll(2) == 1) {
  getUnvettedTemplate(postRapForTemplate);
}
else {
  postRapForTemplate(null, getReliableTemplate());
}
