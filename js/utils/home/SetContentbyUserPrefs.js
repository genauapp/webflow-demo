const levelContainer = document.getElementById("topicDropdown");
const deckContainers = document.getElementsByClassName("Deck");
const nounTab = document.getElementById("nounTab");
const verbTab = document.getElementById("verbTab");
const adjectiveTab = document.getElementById("adjectiveTab");
const adverbTab = document.getElementById("adverbTab");

export default function SetContentbyUserPrefs(level) {
  if (level === null || "") {
    blinkBorder(levelContainer);
  }
}

function blinkBorder(element, times = Infinity, interval = 400) {
  let visible = false;
  let count = 0;
  const max = times * 2; // Yanıp sönme = 2 adım

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

  return blink; // clearInterval ile sonradan durdurulabilir
}

// Kullanıcı nountab'a tıklarsa:
//nounElem.addEventListener("click", () => {
// clearInterval(nounBlink);
//  nounElem.style.border = "";

// verbtab yanıp sönmeye başlasın
//blinkBorder(verbElem);
//});
