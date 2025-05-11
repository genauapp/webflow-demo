/** Payment */
/** // Payment Container | Show/Hide  */

import { PAYMENT_TRIGGER_COUNTER_KEY } from '../../constants/storageKeys.js'
import LocalStorageManager from '../LocalStorageManager.js'

// Helper Enum
export class PaymentTriggerEvent {
  static LEARN = 'learn'
  static EXERCISE = 'exercise'
  static EINBURGERUNGSTEST = 'einburgerungstest'
}

export function decideShowingPaymentWorkflowOn(triggerEvent) {
  const paymentTriggerCount = LocalStorageManager.load(
    PAYMENT_TRIGGER_COUNTER_KEY
  )
  if (paymentTriggerCount[triggerEvent] == 0) {
    showPaymentContainerModal()
    const updatedPaymentTriggerCount = {
      ...paymentTriggerCount,
      [triggerEvent]: paymentTriggerCount[triggerEvent] + 1,
    }
    LocalStorageManager.save(
      PAYMENT_TRIGGER_COUNTER_KEY,
      updatedPaymentTriggerCount
    )
  }
}

function showPaymentContainerModal() {
  console.log('showing: Payment Container Modal')

  //   const isReadyToPayment = LocalStorageManager.load(
  //     IS_READY_TO_PAYMENT,
  //     DEFAULT_VALUE.IS_READY_TO_PAYMENT
  //   )
  const modalContainer = document.getElementById('modal-payment-container')
  modalContainer.style.display = 'flex'

  modalContainer.addEventListener('click', showInitialPaymentModal)

  document
    .querySelectorAll('.button-modal-payment-close')
    .forEach((buttonClose) => {
      buttonClose.addEventListener('click', hideAllModals)
    })
}

const hideAllModals = () => {
  const modalContainer = document.getElementById('modal-payment-container')
  modalContainer.removeEventListener('click', showInitialPaymentModal)

  // LocalStorageManager.save(IS_READY_TO_PAYMENT, false)
  hideInitialPaymentModal()
  hideFinalPaymentModal()
  hidePaymentContainerModal()

  document
    .querySelectorAll('.button-modal-payment-close')
    .forEach((buttonClose) => {
      buttonClose.removeEventListener('click', hideAllModals)
    })
}

function hidePaymentContainerModal() {
  console.log('hiding: Payment Container Modal')

  const modalContainer = document.getElementById('modal-payment-container')
  modalContainer.style.display = 'none'
  modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0)'
}

/** // Initial Payment | Show/Hide  */
function showInitialPaymentModal() {
  console.log('showing: Initial Payment Modal')
  const modalContainer = document.getElementById('modal-payment-container')
  modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.16)'
  modalContainer.removeEventListener('click', showInitialPaymentModal)

  const modalInitialPayment = document.getElementById('modal-payment-initial')
  modalInitialPayment.style.display = 'flex'

  const buttonContinueToPayment = document.getElementById(
    'button-modal-payment-initial-continue'
  )
  buttonContinueToPayment.addEventListener('click', showFinalPaymentModal)

  // attach payment option handlers
  const paymentOptions = document.querySelectorAll('.paymentoption')
  paymentOptions.forEach((option) => {
    // create a named handler so it can be removed later
    const handler = () => {
      // early return if already selected
      if (option.classList.contains('paymentselected')) return

      // unselect all
      paymentOptions.forEach((opt) => {
        opt.classList.remove('paymentselected')
        console.log(`${opt.getAttribute('payment-option')} is unselected.`)
      })
      // select clicked
      option.classList.add('paymentselected')
      console.log(`${option.getAttribute('payment-option')} is selected.`)
    }
    option.addEventListener('click', handler)
    // store handler ref for cleanup
    option._paymentClickHandler = handler
  })
}

function hideInitialPaymentModal() {
  console.log('hiding: Initial Payment Modal')
  const modalInitialPayment = document.getElementById('modal-payment-initial')
  modalInitialPayment.style.display = 'none'

  const buttonContinueToPayment = document.getElementById(
    'button-modal-payment-initial-continue'
  )
  buttonContinueToPayment.removeEventListener('click', showFinalPaymentModal)

  // clean up payment option handlers
  const paymentOptions = document.querySelectorAll('.paymentoption')
  paymentOptions.forEach((option) => {
    if (option._paymentClickHandler) {
      option.removeEventListener('click', option._paymentClickHandler)
      delete option._paymentClickHandler
    }
    option.classList.remove('paymentselected')
  })
}

/** // Final Payment | Show/Hide  */
function showFinalPaymentModal() {
  console.log('showing: Final Payment Modal')

  hideInitialPaymentModal()
  const modalFinalPayment = document.getElementById('modal-payment-final')
  modalFinalPayment.style.display = 'flex'

  const buttonCopyToClipboard = document.getElementById(
    'button-modal-payment-final-copy-clipboard'
  )
  buttonCopyToClipboard.addEventListener('click', copyToClipBoard)
}

const copyToClipBoard = () => {
  const buttonCopyToClipboard = document.getElementById(
    'button-modal-payment-final-copy-clipboard'
  )
  navigator.clipboard.writeText('https://www.genauapp.io')
  buttonCopyToClipboard.removeEventListener('click', copyToClipBoard)
}

function hideFinalPaymentModal() {
  console.log('hiding: Final Payment Modal')
  const modalFinalPayment = document.getElementById('modal-payment-final')
  modalFinalPayment.style.display = 'none'
}
