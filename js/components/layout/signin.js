// /components/layout/signin.js
import { initGoogleAuth } from '../../service/oauth2/googleAuthService.js'
import authService from '../../service/AuthService.js'
import eventService from '../../service/events/EventService.js'
import { AuthEvent } from '../../constants/events.js'

let els = {}
let state = {
  loading: false,
  error: null,
  user: null,
  isVisible: false,
}

function initElements(elementIds) {
  els = {
    modal: document.getElementById(elementIds.signinModal),
    googleButton: document.getElementById(elementIds.googleSigninButton),
  }
}

function render() {
  if (!els.modal) return

  if (state.user) {
    els.modal.style.display = 'none'
  } else {
    els.modal.style.display = state.isVisible ? 'flex' : 'none'
  }
}

function setState(newState) {
  state = { ...state, ...newState }
  render()
}

export async function initSigninComponent(elementIds) {
  initElements(elementIds)
  if (!els.modal || !els.googleButton) return

  setState({ loading: true })

  // Subscribe to auth events instead of making direct API call
  eventService.subscribe(AuthEvent.AUTH_STATE_CHANGED, (event) => {
    const { isLoading, hasError, unauthorized, user } = event.detail
    setState({
      loading: isLoading,
      error: hasError,
      isVisible: !unauthorized,
      user: user,
    })
  })

  await initGoogleAuth(elementIds.googleSigninButton, async (idToken) => {
    await authService.googleSignin(idToken)

    const url = new URL(window.location.href)
    url.searchParams.set('signin-modal-successful', 'true')
    window.history.replaceState({}, '', url)
    window.location.reload()
  })

  // Initial render
  render()
}

// export function showSigninModal() {
//   if (!state.user) setState({ isVisible: true })
// }

// export function hideSigninModal() {
//   setState({ isVisible: false })
// }
