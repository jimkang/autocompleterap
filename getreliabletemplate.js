var probable = require('probable');

var templateProbabilities = {
  '%s, yeah I\'m fucked up now': 12,
  '1, 2, 3 and to the 4 / %s is at the door': 12,
  '%s together, now you know you in trouble': 12,
  'And that\'s realer than Real-Deal Holyfield / And now you %ss know how I feel': 2,
  'If what you say is true, the %s could be dangerous': 7,
  'Blaow! Now it\'s all over / Niggaz seeing pink hearts, yellow moons, %s': 5,
  'Peace to the %s, word is bond': 5,
  'Life ain\'t nothin\' but %s': 8,
  'Plus Puffy tryna see me, weak hearts I rip / %s some mark-ass bitches': 4,
  'You know the M.O.P. status / In the history of %s, we some of the baddest': 5,
  'Droppin\' lyrics that be hotter than %s / And one-dimensional MCs can\'t handle that': 3,
  'Supreme exalted, universal leader / Descendent of the %s, the overseer': 5,
  'Caught you tremblin, my %s you\'re rememberin\'': 3,
  'They start scheming, feeling that you\'re too swollen / and that\'s the reason why your %s gets stolen': 3,
  'Premier in the rear with the %s / And Guru with the mic ready to tear shit up': 3
};

var table = probable.createRangeTableFromDict(templateProbabilities);

function getReliableTemplate() {
  return table.roll();
}

module.exports = getReliableTemplate;
