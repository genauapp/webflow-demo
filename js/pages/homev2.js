import { logout } from '../service/authService.js'
import { initGoogleAuth } from '../service/oauth2/googleAuthService.js'
import { getUserProfile } from '../service/userService.js'

const state = {
  user: null,
  loading: true,
  error: null,
  unauthorized: false,
}

const els = {
  login: () => document.getElementById('login-container'),
  profile: () => document.getElementById('user-profile-container'),
  name: () => document.getElementById('label-user-info-name'),
  email: () => document.getElementById('label-user-info-email'),
  errorMsg: () => document.getElementById('error-message'), // add an element in your HTML
  spinner: () => document.getElementById('loading-spinner'), // idem
}

function render() {
  if (state.loading) {
    els.spinner().style.display = 'block'
    els.login().style.display = 'none'
    els.profile().style.display = 'none'
    els.errorMsg().style.display = 'none'
    return
  }

  els.spinner().style.display = 'none'

  if (state.error) {
    els.errorMsg().innerText = `Error: ${state.error.message}`
    els.errorMsg().style.display = 'block'
    els.login().style.display = 'none'
    els.profile().style.display = 'none'
    return
  }

  if (state.unauthorized || !state.user) {
    // treat 401/403 or no user as unauthenticated
    els.login().style.display = 'flex'
    els.profile().style.display = 'none'
  } else {
    // authenticated
    els.login().style.display = 'none'
    els.profile().style.display = 'flex'
    els.name().innerText = state.user.name
    els.email().innerText = state.user.email
  }
}

async function bootstrap() {
  const profileResult = await getUserProfile()
  state.loading = profileResult.loading
  state.user = profileResult.user
  state.error = profileResult.error
  state.unauthorized = [401, 403].includes(profileResult.status)
  render()

  await initGoogleAuth(onLoginSuccess, onLoginError)
}

async function onLoginSuccess(result) {
  state.user = result.user
  state.error = null
  state.unauthorized = false
  render()
}

function onLoginError(err) {
  console.error(err)
  state.error = err
  render()
}

async function onLogoutClick() {
  await logout()
  state.user = null
  state.unauthorized = true
  render()
}

document.addEventListener('DOMContentLoaded', bootstrap)
document
  .getElementById('btn-home-logout')
  .addEventListener('click', onLogoutClick)
