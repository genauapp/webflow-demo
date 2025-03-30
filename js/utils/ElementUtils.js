import { ASSETS_BASE_URL } from '../constants/urls.js'
import WordUtils from './WordUtils.js'

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

  static showSkeleton(skeletonElementId, hidingElementId) {
    const skeletonContainer = document.getElementById(skeletonElementId)
    const hidingElementContainer = document.getElementById(hidingElementId)

    if (hidingElementContainer) {
      hidingElementContainer.style.display = 'none'
    }

    if (skeletonContainer) {
      skeletonContainer.style.display = 'flex'
    }
  }

  static hideSkeleton = (skeletonElementId, showingElementId) => {
    const skeletonContainer = document.getElementById(skeletonElementId)
    const showingElementContainer = document.getElementById(showingElementId)

    if (skeletonContainer) {
      skeletonContainer.style.display = 'none'
    }

    if (showingElementContainer) {
      showingElementContainer.style.display = 'flex'
    }
  }

  static showImageIfExists(imageElementId, question) {
    const imageElement = document.getElementById(imageElementId)

    if (question.has_image) {
      // Show a placeholder while loading
      imageElement.src = `https://cdn.prod.website-files.com/677da6ae8464f53ea15d73ac/67e97dd7bd1a0d94d2e0c10b_Img-Placeholder.svg`
      imageElement.style.display = 'flex'

      const realImage = new Image()
      realImage.onload = function () {
        // Replace placeholder with the loaded image
        imageElement.src = realImage.src
      }
      realImage.onerror = function () {
        // Optionally handle load errors
        console.error('Failed to load image')
      }

      // url-encode state and id
      // const normalizedState = WordUtils.replaceUmlauts(question.state)
      const encodedState = encodeURIComponent(normalizedState)
      const encodedId = encodeURIComponent(question.id)

      realImage.src = `${ASSETS_BASE_URL}/assets/images/einburgerungstest/questions/${encodedState}/${encodedId}.png`
    } else {
      imageElement.style.display = 'none'
    }
  }
}
