import { getUserProfile } from '../service/userService.js'
import { initGoogleAuth } from '../service/oauth2/googleAuthService.js'
import { logout } from '../service/authService.js'

const els = {
  login: () => document.getElementById('login-container'),
  profile: () => document.getElementById('user-profile-container'),
  name: () => document.getElementById('label-user-info-name'),
  email: () => document.getElementById('label-user-info-email'),
  // spinner: () => document.getElementById('loading-spinner'),
  // errorMsg: () => document.getElementById('error-message'),
  logoutBtn: () => document.getElementById('btn-home-logout'),
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
  if (loading) {
    els.login().style.display = 'none'
    // showing loading in there
    els.profile().style.display = 'flex'
    els.name().innerText = 'user...'
    els.email().innerText = 'checking user info...'
    return
  }

  // error state
  if (error) {
    //   els.errorMsg().innerText = error.message
    //   els.errorMsg().style.display = 'block'
    // alert(`Error: ${error.message}`)
    // fallback to login
    els.login().style.display = 'flex'
    els.profile().style.display = 'none'
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
  render({ loading: true })

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
  // disable button and show spinner
  els.logoutBtn().disabled = true
  render({ loading: true })

  try {
    await logout()
    // after success, clear user
    render({ loading: false, unauthorized: true, user: null })
  } catch (err) {
    // on error, re-enable button and show message
    els.logoutBtn().disabled = false
    render({ loading: false, error: err })
  }
}

document.addEventListener('DOMContentLoaded', bootstrap)
els.logoutBtn().addEventListener('click', onLogoutClick)
