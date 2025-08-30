// components/level/packJourney/returnToJourneyButton.js
let els = {}
let onConfirmCallback = null

function initElements() {
  els = {
    container: document.getElementById('return-to-journey-button-container'),
    button: document.getElementById('return-to-journey-button'),
    label: document.getElementById('return-to-journey-button-label'),

    modal: document.getElementById('return-confirmation-modal'),
    confirmBtn: document.getElementById('confirm-back-button'),
    cancelBtn: document.getElementById('cancel-back-button'),
  }
}

function handleConfirm() {
  onConfirmCallback()
  // els.modal.style.display = 'none'
}

function handleCancel() {
  // els.modal.style.display = 'none'
}

function handleButtonClick() {
  // els.modal.style.display = 'flex'
}

export function mountReturnToJourneyButton(packName, onConfirm) {
  initElements()
  onConfirmCallback = onConfirm

  // Set button text
  els.label.textContent = `Return to ${packName}`

  // Attach event handlers
  els.button.addEventListener('click', handleConfirm)

  // els.button.addEventListener('click', handleButtonClick)
  // els.confirmBtn.addEventListener('click', handleConfirm)
  // els.cancelBtn.addEventListener('click', handleCancel)

  // Show button
  els.container.style.display = 'flex'
}

export function unmountReturnToJourneyButton() {
  // Hide button and modal
  if (els.container) els.container.style.display = 'none'
  // els.modal.style.display = 'none'

  // Clean up event listeners
  if (els.button) els.button.removeEventListener('click', handleConfirm)

  // if (els.button) els.button.removeEventListener('click', handleButtonClick)
  // els.confirmBtn.removeEventListener('click', handleConfirm)
  // els.cancelBtn.removeEventListener('click', handleCancel)

  // Reset state
  els = {}
  onConfirmCallback = null
}
