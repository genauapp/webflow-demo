// /components/layout/user.js
import { initGoogleAuth } from '../../service/oauth2/googleAuthService.js'
import eventService from '../../service/events/EventService.js'
import authService from '../../service/AuthService.js'
import { AuthEvent } from '../../constants/events.js'

let els = {}

/** Initialize elements dynamically using provided IDs */
function initElements(elementIds, elementClasses) {
  els = {
    loginContainer: () => document.getElementById(elementIds.loginContainer),

    profileContainers: () =>
      Array.from(
        document.querySelectorAll(`.${elementClasses.profileContainer}`)
      ),
    avatarImages: () =>
      Array.from(document.querySelectorAll(`.${elementClasses.avatar}`)),
    nameLabels: () =>
      Array.from(document.querySelectorAll(`.${elementClasses.name}`)),
    emailLabels: () =>
      Array.from(document.querySelectorAll(`.${elementClasses.email}`)),
    logoutButtons: () =>
      Array.from(document.querySelectorAll(`.${elementClasses.logoutButton}`)),
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
    els.loginContainer().style.display = 'none'

    els.profileContainers().forEach((element) => {
      element.style.display = 'none'
    })
    return
  }

  // error state
  if (error) {
    // fallback to login
    els.loginContainer().style.display = 'flex'

    els.profileContainers().forEach((element) => {
      element.style.display = 'none'
    })
    els.logoutButtons().forEach((element) => {
      element.style.display = 'none'
    })
    return
  }

  // unauthorized or no user
  if (unauthorized || !user) {
    els.loginContainer().style.display = 'flex'

    els.profileContainers().forEach((element) => {
      element.style.display = 'none'
    })
    els.logoutButtons().forEach((element) => {
      element.style.display = 'none'
    })
  } else {
    els.loginContainer().style.display = 'none'

    els.profileContainers().forEach((element) => {
      element.style.display = 'flex'
    })
    els.avatarImages().forEach((element) => {
      element.src = user['avatar_url']
    })
    els.nameLabels().forEach((element) => {
      element.innerText = user.name
    })
    els.emailLabels().forEach((element) => {
      element.innerText = user.email
    })
    els.logoutButtons().forEach((element) => {
      element.style.display = 'flex'
    })
  }
}

async function onLogoutClick() {
  // disable button and show spinner
  els.logoutButtons().forEach((element) => {
    element.disabled = true
  })

  render({ loading: true })

  // Use authService instead of direct API call
  await authService.logout()
}

/** Initialize the user component */
export async function initUserComponent(elementIds, elementClasses) {
  // Initialize elements with provided IDs
  initElements(elementIds, elementClasses)

  render({ loading: true })

  // Subscribe to auth events
  eventService.subscribe(AuthEvent.AUTH_STATE_CHANGED, (event) => {
    const { isLoading, hasError, unauthorized, user } = event.detail

    if (unauthorized) {
      // Re-enable logout buttons
      els.logoutButtons().forEach((element) => {
        element.disabled = false
      })
    }

    render({ loading: isLoading, error: hasError, unauthorized, user })
  })

  initGoogleAuth(
    elementIds.googleSigninButton,
    async (idToken) => await authService.googleSignin(idToken)
  )

  // Add logout event listener
  els.logoutButtons().forEach((element) => {
    element.addEventListener('click', onLogoutClick)
  })
}
