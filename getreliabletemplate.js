var probable = require('probable');

var templateProbabilities = {
  '%s, yeah I\'m fucked up now': 30,
  '1, 2, 3 and to the 4 / %s is at the door': 20,
  '%s together, now you know you in trouble': 20,
  'And that\'s realer than Real-Deal Holyfield / And now you %s know how I feel': 8,
  'If what you say is true, the %s could be dangerous': 7,
  'Blaow!  Now it\'s all over/ Niggaz seeing pink hearts, yellow moons, %s': 5,
  'Peace to all the %s, word is bond': 5,
  'Life ain\'t nothin\' but %s': 12,
  'Plus Puffy tryna see me, weak hearts I rip / %s some mark-ass bitches': 5
};

var table = probable.createRangeTableFromDict(templateProbabilities);

function getReliableTemplate() {
  return table.roll();
}

module.exports = getReliableTemplate;
