let levelBlinkInterval = null;
let deckBlinkIntervals = [];

export default function SetContentbyUserPrefs(level) {
  if (level === null || level === "") {
    levelBlinkInterval = blinkBorder(levelContainer);
  } else {
    clearBlinkEffect(levelContainer, levelBlinkInterval);

    deckBlinkIntervals = Array.from(deckContainers).map((el) => {
      return blinkBorder(el);
    });
  }
}

function blinkBorder(element, times = Infinity, interval = 400) {
  let visible = false;
  let count = 0;
  const max = times * 2;

  const blink = setInterval(() => {
    element.style.border = visible
      ? "2px solid limegreen"
      : "2px solid transparent";
    visible = !visible;
    count++;

    if (times !== Infinity && count >= max) {
      clearInterval(blink);
      element.style.border = "";
    }
  }, interval);

  return blink;
}

function clearBlinkEffect(element, intervalId) {
  clearInterval(intervalId);
  element.style.border = "";
}
