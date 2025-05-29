// /components/home/user.js
import {
  protectedApiService,
  publicApiService,
} from '../../service/apiService.js'
import { initGoogleAuth } from '../../service/oauth2/googleAuthService.js'

let els = {}

/** Initialize elements dynamically using provided IDs */
function initElements(elementIds) {
  els = {
    login: () => document.getElementById(elementIds.login),
    profile: () => document.getElementById(elementIds.profile),
    avatar: () => document.getElementById(elementIds.avatar),
    name: () => document.getElementById(elementIds.name),
    email: () => document.getElementById(elementIds.email),
    logoutBtn: () => document.getElementById(elementIds.logoutBtn),
  }
}

/** Show/hide according to simple flags */
function render({ loading, error, unauthorized, user }) {
  // console.log('User Component States:')
  // console.log(`-> loading: ${loading}`)
  // console.log(`-> error: ${error}`)
  // console.log(`-> unauthorized: ${unauthorized}`)
  // console.log(`-> user: ${user}`)

  // loading state
  if (loading) {
    els.login().style.display = 'none'

    els.profile().style.display = 'none'
    return
  }

  // error state
  if (error) {
    // fallback to login
    els.login().style.display = 'flex'

    els.profile().style.display = 'none'
    els.logoutBtn().style.display = 'none'
    return
  }

  // unauthorized or no user
  if (unauthorized || !user) {
    els.login().style.display = 'flex'

    els.profile().style.display = 'none'
    els.logoutBtn().style.display = 'none'
  } else {
    els.login().style.display = 'none'

    els.profile().style.display = 'flex'
    els.name().innerText = user.name
    els.email().innerText = user.email
    els.avatar().src = user['avatar_url']
    els.logoutBtn().style.display = 'flex'
  }
}

function onLoginSuccess(user) {
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
    await publicApiService.logout()
    // after success, clear user
    render({ loading: false, unauthorized: true, user: null })
  } catch (err) {
    // on error, re-enable button and show message
    els.logoutBtn().disabled = false
    render({ loading: false, error: err })
  }
}

/** Initialize the user component */
export async function initUserComponent(elementIds) {
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

  await initGoogleAuth(onLoginSuccess, onLoginError)

  // Add logout event listener
  els.logoutBtn().addEventListener('click', onLogoutClick)
}
