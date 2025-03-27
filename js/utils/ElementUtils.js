export default class ElementUtils {
  static switchButtonActivation = (button, isDisabled) => {
    if (isDisabled) {
      // disable it on the UI
      ElementUtils.makeButtonDisabled(button)
    } else {
      // enable it on the UI
      ElementUtils.makeButtonEnabled(button)
    }
  }

  static makeButtonDisabled = (element) => {
    element.style.opacity = '0.5'
    element.style.pointerEvents = 'none'
  }

  static makeButtonEnabled = (element) => {
    element.style.opacity = 'inherit'
    element.style.pointerEvents = 'inherit'
  }

  static switchPreviousNextButtons = (
    potentialQuestionIndex,
    totalNumberOfQuestions,
    { prevButton, nextButton }
  ) => {
    const isPreviousFirst = potentialQuestionIndex === 1
    const isNextLast = potentialQuestionIndex === totalNumberOfQuestions

    ElementUtils.switchButtonActivation(prevButton, isPreviousFirst)
    ElementUtils.switchButtonActivation(nextButton, isNextLast)
  }
}
