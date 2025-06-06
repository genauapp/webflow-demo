// /layout/modal/signin.js
import {
  initSigninComponent,
  showSigninModal,
  hideSigninModal,
} from '../../components/layout/signin.js'
import { SigninModalTriggerEvent } from '../../constants/events.js'

import { incrementEventCount, shouldTriggerModal } from '../../utils/events/eventCounter/eventCounterManager.js'

const elementIds = {
  signin: {
    signinModal: 'modal-signin-container',
    googleSigninButton: 'btn-modal-google-signin',
  },
}

async function bootstrap() {
  await initSigninComponent({ ...elementIds.signin })

  // Add event listeners for all trigger events
  Object.values(SigninModalTriggerEvent).forEach((eventName) => {
    document.addEventListener(eventName, () => {
      // Update counter and check if we should trigger
      incrementEventCount(eventName)

      if (shouldTriggerModal(eventName)) {
        showSigninModal()
      }
    })
  })

  // DON'T CLOSE modal when clicking outside
  // document.addEventListener('click', (e) => {
  //   const modal = document.getElementById(elementIds.signin.signinModal)
  //   if (modal && e.target === modal) {
  //     hideSigninModal()
  //   }
  // })
}

document.addEventListener('DOMContentLoaded', bootstrap)
