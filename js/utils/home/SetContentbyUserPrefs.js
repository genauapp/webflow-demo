const levelContainer = document.getElementById("topicDropdown");
const deckContainers = document.getElementsByClassName("deck");

let levelBlinkInterval = null;
let deckBlinkIntervals = [];

export default function SetContentbyUserPrefs(level, category) {
  if (level === "" && category === "") {
    levelBlinkInterval = blinkBorder(levelContainer);
  } else if(level !== "" && category === "") {
    clearBlinkEffect(levelContainer, levelBlinkInterval);
    clearAllDeckBlinkEffects(); // <-- Tüm deck efektlerini önce temizle

    deckBlinkIntervals = Array.from(deckContainers).map(el => {
      return blinkBorder(el);
    });
  } else {
    clearBlinkEffect(levelContainer, levelBlinkInterval);
    clearAllDeckBlinkEffects();
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

function clearAllDeckBlinkEffects() {
  deckBlinkIntervals.forEach((intervalId, index) => {
    clearInterval(intervalId);
    if (deckContainers[index]) {
      deckContainers[index].style.border = "";
    }
  });
  deckBlinkIntervals = [];
}