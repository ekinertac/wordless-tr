const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiCurrent = 0;

export default function (event, selectedWord) {
  // If the key isn't in the pattern, or isn't the current key in the pattern, reset
  if (konamiPattern.indexOf(event.key) < 0 || event.key !== konamiPattern[konamiCurrent]) {
    konamiCurrent = 0;
    return;
  }

  // Update how much of the konamiPattern is complete
  konamiCurrent++;

  // If complete, alert and reset
  if (konamiPattern.length === konamiCurrent) {
    konamiCurrent = 0;
    console.log(selectedWord)
  }

};