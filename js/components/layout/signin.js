import {
  protectedApiService,
  publicApiService,
} from '../../service/apiService.js'
import { initGoogleAuth } from '../../service/oauth2/googleAuthService.js'

let els = {}

/** Initialize elements dynamically using provided IDs */
function initElements(elementIds) {
  els = {
    modal: () => document.getElementById(elementIds.signinModal),
  }
}

/** Show/hide according to simple flags */
function render({ loading, error, unauthorized, user }) {

  if (loading) {
    // nothing
  }

  // error state
  if (error) {
    // nothing
  }

  // unauthorized or no user
  if (unauthorized || !user) {
    els.modal().style.display = 'flex'
  } else {
    els.modal().style.display = 'none'
  }
}

function onLoginSuccess(user) {
  render({ loading: false, error: null, unauthorized: false, user })
  window.location.reload()
}

function onLoginError(err) {
  render({ loading: false, error: err, unauthorized: true, user: null })
}

/** Initialize the user component */
export async function initSigninComponent(elementIds) {
  // Initialize elements with provided IDs
  initElements(elementIds)

  render({ loading: true })

  const {
    data: user,
    status,
    error,
  } = await protectedApiService.getUserProfile()
  const unauthorized = status === 401 || status === 403

  render({ loading: false, error, unauthorized, user })

  await initGoogleAuth(elementIds.googleSigninButton, onLoginSuccess, onLoginError)
}