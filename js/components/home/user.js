// /components/home/user.js
import {
  protectedApiService,
  publicApiService,
} from '../../service/apiService.js'
import { initGoogleAuth } from '../../service/oauth2/googleAuthService.js'

let els = {}

/** Initialize elements dynamically using provided IDs */
function initElements(elementIds, elementClasses) {
  els = {
    login: () => document.getElementById(elementIds.login),

    profileElements: () =>
      document.querySelectorAll(`.${elementClasses.profile}`),
    avatarElements: () =>
      document.querySelectorAll(`.${elementClasses.avatar}`),
    nameElements: () => document.querySelectorAll(`.${elementClasses.name}`),
    emailElements: () => document.querySelectorAll(`.${elementClasses.email}`),
    logoutButtonElements: () =>
      document.querySelectorAll(`.${elementClasses.logoutButton}`),
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

    els.profileElements().array.forEach((element) => {
      element.style.display = 'none'
    })
    return
  }

  // error state
  if (error) {
    // fallback to login
    els.login().style.display = 'flex'

    els.profileElements().array.forEach((element) => {
      element.style.display = 'none'
    })
    els.logoutButtonElements().array.forEach((element) => {
      element.style.display = 'none'
    })
    return
  }

  // unauthorized or no user
  if (unauthorized || !user) {
    els.login().style.display = 'flex'

    els.profileElements().array.forEach((element) => {
      element.style.display = 'none'
    })
    els.logoutButtonElements().array.forEach((element) => {
      element.style.display = 'none'
    })
  } else {
    els.login().style.display = 'none'

    els.profileElements().array.forEach((element) => {
      element.style.display = 'flex'
    })
    els.avatarElements().array.forEach((element) => {
      element.src = user['avatar_url']
    })
    els.nameElements().array.forEach((element) => {
      element.innerText = user.name
    })
    els.emailElements().array.forEach((element) => {
      element.innerText = user.email
    })
    els.logoutButtonElements().array.forEach((element) => {
      element.style.display = 'flex'
    })
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
  els.logoutButtonElements().array.forEach((element) => {
    element.disabled = true
  })

  render({ loading: true })

  try {
    await publicApiService.logout()
    // after success, clear user
    render({ loading: false, unauthorized: true, user: null })
  } catch (err) {
    // on error, re-enable button and show message
    els.logoutButtonElements().array.forEach((element) => {
      element.disabled = false
    })
    render({ loading: false, error: err })
  }
}

/** Initialize the user component */
export async function initUserComponent(elementIds, elementClasses) {
  // Initialize elements with provided IDs
  initElements(elementIds, elementClasses)

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
  els.logoutButtonElements().array.forEach((element) => {
    element.addEventListener('click', onLogoutClick)
  })
}
