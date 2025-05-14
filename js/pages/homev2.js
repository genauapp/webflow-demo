import { getUserProfile } from './service/userService.js'
import { initGoogleAuth } from './service/oauth2/googleAuthService.js'
import { logout } from './service/authService.js'

const els = {
  login: () => document.getElementById('login-container'),
  profile: () => document.getElementById('user-profile-container'),
  name: () => document.getElementById('label-user-info-name'),
  email: () => document.getElementById('label-user-info-email'),
  // spinner: () => document.getElementById('loading-spinner'),
  // errorMsg: () => document.getElementById('error-message'),
}

/** Show/hide according to simple flags */
function render({ loading, error, unauthorized, user }) {
  console.log('States:')
  console.log(`-> loading: ${loading}`)
  console.log(`-> error: ${error}`)
  console.log(`-> unauthorized: ${unauthorized}`)
  console.log(`-> user: ${user}`)

  // loading state
  // els.spinner().style.display = loading ? 'block' : 'none'
  if (loading) return

  // error state
  if (error) {
    //   els.errorMsg().innerText = error.message
    //   els.errorMsg().style.display = 'block'
    //   els.login().style.display = 'none'
    //   els.profile().style.display = 'none'
    return
  }

  // els.errorMsg().style.display = 'none'

  // unauthorized or no user
  if (unauthorized || !user) {
    els.login().style.display = 'flex'
    els.profile().style.display = 'none'
  } else {
    els.login().style.display = 'none'
    els.profile().style.display = 'flex'
    els.name().innerText = user.name
    els.email().innerText = user.email
  }
}

async function bootstrap() {
  render({ loading: true }) // start loader

  const { user, status, error } = await getUserProfile()
  const unauthorized = status === 401 || status === 403

  render({ loading: false, error, unauthorized, user })

  await initGoogleAuth(onLoginSuccess, onLoginError)
}

function onLoginSuccess({ user }) {
  render({ loading: false, error: null, unauthorized: false, user })
}

function onLoginError(err) {
  render({ loading: false, error: err, unauthorized: true, user: null })
}

async function onLogoutClick() {
  await logout()
  render({ loading: false, error: null, unauthorized: true, user: null })
}

document.addEventListener('DOMContentLoaded', bootstrap)
document
  .getElementById('btn-home-logout')
  .addEventListener('click', onLogoutClick)
