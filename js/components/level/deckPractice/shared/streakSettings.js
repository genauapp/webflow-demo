// components/level/deckPractice/shared/streakSettings.js
let els = {}

function initElements() {
  els = {
    container: () =>
      document.getElementById('deck-practice-streak-target-selector'),
    option1: () => document.getElementById('streak-target-option-1'),
    option3: () => document.getElementById('streak-target-option-3'),
    option5: () => document.getElementById('streak-target-option-5'),
  }
}

function handleOptionClick(selectedTarget, callback) {
  // Update UI
  ;[els.option1(), els.option3(), els.option5()].forEach((option) => {
    option.classList.toggle(
      'selected',
      parseInt(option.dataset.value) === selectedTarget
    )
  })

  // Execute callback after visual feedback
  setTimeout(() => callback(selectedTarget), 300)
}

export function initStreakSettings(onTargetSelected) {
  initElements()

  // Add event listeners
  els
    .option1()
    .addEventListener('click', () => handleOptionClick(1, onTargetSelected))
  els
    .option3()
    .addEventListener('click', () => handleOptionClick(3, onTargetSelected))
  els
    .option5()
    .addEventListener('click', () => handleOptionClick(5, onTargetSelected))
}
