/* global process, __dirname */

var createPairRapper = require('./pairrapper');
var autocompl = require('autocompl');
var probable = require('probable');
var createWordnok = require('wordnok').createWordnok;
var config = require('./config');
var lineChomper = require('line-chomper');
var jsonfile = require('jsonfile');
var getReliableTemplate = require('./getreliabletemplate');
var Twit = require('twit');
var callNextTick = require('call-next-tick');

var StaticWebArchiveOnGit = require('static-web-archive-on-git');
var queue = require('d3-queue').queue;
var randomId = require('idmaker').randomId;

var staticWebStream = StaticWebArchiveOnGit({
  config: config.github,
  title: config.archiveName,
  footerScript: `<script type="text/javascript">
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-49491163-1', 'jimkang.com');
  ga('send', 'pageview');
</script>`,
  maxEntriesPerPage: 50
});

var dryRun = false;

if (process.argv.length > 2) {
  dryRun = process.argv[2].toLowerCase() == '--dry';
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
  } else {
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
    console.log(error, rap);
    console.log('Trying again.');
    callNextTick(postAutocompleteRap);
  } else {
    console.log(rap);
    if (!dryRun) {
      postToTargets(rap, logError);
    }
  }
}

function logError(error, data) {
  if (error) {
    console.log(error);
    console.log('data:', data);
  }
}

function postToTargets(text, done) {
  var q = queue();
  q.defer(postTweet, text);
  q.defer(postToArchive, text);
  q.await(done);
}

function postTweet(text, done) {
  var body = {
    status: text
  };
  twit.post('statuses/update', body, done);
}

function postToArchive(text, done) {
  var id = 'rap-' + randomId(8);
  staticWebStream.write({
    id,
    date: new Date().toISOString(),
    caption: text
  });
  staticWebStream.end(done);
}

function getUnvettedTemplate(done) {
  var templateOffsets = jsonfile.readFileSync(
    __dirname + '/templatelineoffsets.json'
  );
  var offsetToGet = probable.pickFromArray(templateOffsets);
  lineChomper.chomp(
    __dirname + '/templates.txt',
    {
      lineOffsets: templateOffsets,
      fromLine: offsetToGet.line,
      lineCount: 1
    },
    function readDone(error, lines) {
      var line;
      if (error) {
        console.log(error);
      } else if (!lines || !Array.isArray(lines) || lines.length < 1) {
        console.log('Could not get valid line for offset ', offsetToGet);
      } else {
        line = lines[0];
      }

      done(error, line);
    }
  );
}

function postAutocompleteRap() {
  if (probable.roll(8) === 0) {
    postRapForTemplate(null, getReliableTemplate());
  } else {
    getUnvettedTemplate(postRapForTemplate);
  }
}

postAutocompleteRap();
