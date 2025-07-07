// components/level/packJourney/backToJourneyButton.js
let els = {}
let onConfirmCallback = null

function initElements() {
  els = {
    button: document.getElementById('back-to-journey-button'),
    modal: document.getElementById('back-confirmation-modal'),
    confirmBtn: document.getElementById('confirm-back-button'),
    cancelBtn: document.getElementById('cancel-back-button'),
  }
}

function handleConfirm() {
  if (typeof onConfirmCallback === 'function') {
    onConfirmCallback()
  }
  // els.modal.style.display = 'none'
}

function handleCancel() {
  // els.modal.style.display = 'none'
}

function handleButtonClick() {
  // els.modal.style.display = 'block'
}

export function mountBackToJourneyButton(packName, onConfirm) {
  initElements()
  onConfirmCallback = onConfirm

  // Set button text
  els.button.textContent = `Return to ${packName}`

  // Attach event handlers
  els.button.addEventListener('click', handleButtonClick)
  // els.confirmBtn.addEventListener('click', handleConfirm)
  // els.cancelBtn.addEventListener('click', handleCancel)

  // Show button
  els.button.style.display = 'block'
}

export function unmountBackToJourneyButton() {
  // Hide button and modal
  els.button.style.display = 'none'
  // els.modal.style.display = 'none'

  // Clean up event listeners
  els.button.removeEventListener('click', handleButtonClick)
  // els.confirmBtn.removeEventListener('click', handleConfirm)
  // els.cancelBtn.removeEventListener('click', handleCancel)

  // Reset state
  els = {}
  onConfirmCallback = null
}
