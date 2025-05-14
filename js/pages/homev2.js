import { logout } from '../service/authService.js'
import { initGoogleAuth } from '../service/oauth2/googleAuthService.js'
import { getUserProfile } from '../service/userService.js'

/**
 * Application state and central render function
 */
const state = {
  user: null,
  isLoading: true,
  error: null,
}

const els = {
  loginContainer: () => document.getElementById('login-container'),
  profileContainer: () => document.getElementById('user-profile-container'),
  nameLabel: () => document.getElementById('label-user-info-name'),
  emailLabel: () => document.getElementById('label-user-info-email'),
}

/**
 * Update the DOM based on current state
 */
function render() {
  const { user, isLoading } = state

  if (isLoading) {
    // you could show a spinner here
    els.loginContainer().style.display = 'none'
    els.profileContainer().style.display = 'none'
    return
  }

  if (!user) {
    // unauthenticated
    els.loginContainer().style.display = 'flex'
    els.profileContainer().style.display = 'none'
  } else {
    // authenticated
    els.loginContainer().style.display = 'none'
    els.profileContainer().style.display = 'flex'
    els.nameLabel().innerText = user.name
    els.emailLabel().innerText = user.email
  }
}

/**
 * Initialize page: fetch profile and set up Google Auth
 */
async function bootstrap() {
  try {
    const resp = await getUserProfile()
    state.user = resp.user // may be null
  } catch (err) {
    state.error = err
    console.error('Profile fetch error', err)
  } finally {
    state.isLoading = false
    render()
  }

  // set up Google button
  await initGoogleAuth(onLoginSuccess, onLoginError)
}

async function onLoginSuccess(result) {
  console.log('Login successful:', result)
  state.user = result.user
  render()
}

function onLoginError(err) {
  console.error('Login error:', err)
  // optionally set state.error
}

/**
 * Logout handler
 */
async function onLogoutClick() {
  try {
    await logout()
  } catch (err) {
    console.error('Logout failed', err)
  } finally {
    state.user = null
    render()
  }
}

// Wire up DOM events
document.addEventListener('DOMContentLoaded', bootstrap)
document
  .getElementById('btn-home-logout')
  .addEventListener('click', onLogoutClick)
