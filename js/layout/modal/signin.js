// /layout/modal/signin.js
import {
  hideSigninModal,
  initSigninComponent,
  showSigninModal,
} from '../../components/layout/signin.js'
import { SigninModalTriggerEvent } from '../../constants/events.js'
import {
  incrementEventCount,
  shouldTriggerModal,
} from '../../service/events/counter/signinModalTriggerCounterService.js'
import eventService from '../../service/events/EventService.js'

let unauthorized = true

const elementIds = {
  signin: {
    signinModal: 'modal-signin-container',
    googleSigninButton: 'btn-modal-google-signin',
  },
}

async function bootstrap() {
  initSigninComponent({ ...elementIds.signin })

  // Subscribe to auth events
  eventService.subscribe(
    AuthEvent.AUTH_STATE_CHANGED,
    (event) => (unauthorized = event.detail.unauthorized)
  )

  // Add event listeners for all trigger events
  Object.values(SigninModalTriggerEvent).forEach((eventName) => {
    eventService.subscribe(eventName, () => {
      // Update counter and check if we should trigger
      incrementEventCount(eventName)

      if (unauthorized && shouldTriggerModal(eventName)) {
        showSigninModal()
      } else {
        hideSigninModal()
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
