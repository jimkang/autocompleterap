var probable = require('probable');

var templateProbabilities = {
  '%s, yeah I\'m fucked up now': 20,
  '1, 2, 3 and to the 4 / %s is at the door': 18,
  '%s together, now you know you in trouble': 18,
  'And that\'s realer than Real-Deal Holyfield / And now you %ss know how I feel': 5,
  'If what you say is true, the %s could be dangerous': 7,
  'Blaow! Now it\'s all over / Niggaz seeing pink hearts, yellow moons, %s': 5,
  'Peace to the %s, word is bond': 5,
  'Life ain\'t nothin\' but %s': 10,
  'Plus Puffy tryna see me, weak hearts I rip / %s some mark-ass bitches': 5,
  'You know the M.O.P. status / In the history of %s we some of the baddest': 5,
  'Cause MCs have used up extended warranties / While real %s are a minority': 3,
  'Droppin lyrics that be hotter than %s / And one-dimensional MCs can\'t handle that': 3,
  'Supreme exalted, universal leader / Descendent of the %s, the overseer': 5,
  'I %s, shall bring disaster to evil factors / Demonic chapters, shall be captured by Kings': 3,
  'Society puts the squeeze on MCs like iron grips of death / From here on in %s long cherish your breath': 3,
  'Caught you tremblin, my %s you\'re rememberin\'': 3,
  'They start scheming, feeling that you\'re too swollen / and that\'s the reason why your %s gets stolen': 3,
  'Premier in the rear with the %s / And Guru with the mic ready to tear shit up': 3,
  'So think twice blink twice now your %s gone / Don\'t come into this rap game if you don\'t belong': 3  
};

var table = probable.createRangeTableFromDict(templateProbabilities);

function getReliableTemplate() {
  return table.roll();
}

module.exports = getReliableTemplate;
