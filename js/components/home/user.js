import {
  protectedApiService,
  publicApiService,
} from '../../service/apiService.js'
import { initGoogleAuth } from '../../service/oauth2/googleAuthService.js'

// 1) Import our slide helpers
import { slideOpen, slideClose } from '../../utils/ui/slide.js'

let els = {}

/**
 * initElements: store getter functions for all relevant DOM nodes
 */
function initElements(elementIds, elementClasses) {
  els = {
    loginContainer: () => document.getElementById(elementIds.loginContainer),

    profileElements: () =>
      Array.from(document.querySelectorAll(`.${elementClasses.profile}`)),
    avatarElements: () =>
      Array.from(document.querySelectorAll(`.${elementClasses.avatar}`)),
    nameElements: () =>
      Array.from(document.querySelectorAll(`.${elementClasses.name}`)),
    emailElements: () =>
      Array.from(document.querySelectorAll(`.${elementClasses.email}`)),
    logoutButtonElements: () =>
      Array.from(document.querySelectorAll(`.${elementClasses.logoutButton}`)),
  }
}

/**
 * render: show/hide containers using slideOpen/slideClose instead of style.display
 */
function render({ loading, error, unauthorized, user }) {
  const loginContainerEl = els.loginContainer()
  const profileEls = els.profileElements() // Array of profile section containers
  const avatarEls = els.avatarElements() // <img> tags inside profile
  const nameEls = els.nameElements() // <span> or <div> for user name
  const emailEls = els.emailElements() // <span> or <div> for user email
  const logoutEls = els.logoutButtonElements() // Array of logout button(s)

  // ─── 1) LOADING: hide everything ─────────────────────────────────────────────
  if (loading) {
    slideClose(loginContainerEl)
    profileEls.forEach(slideClose)
    logoutEls.forEach(slideClose)
    return
  }

  // ─── 2) ERROR: show login, hide profile + logout ─────────────────────────────
  if (error) {
    // Show login button as FLEX container
    slideOpen(loginContainerEl, 'flex')
    // Hide any previously visible profile or logout
    profileEls.forEach(slideClose)
    logoutEls.forEach(slideClose)
    return
  }

  // ─── 3) UNAUTHORIZED or NO USER: same as “ERROR” (profile & logout hidden) ───
  if (unauthorized || !user) {
    slideOpen(loginContainerEl, 'flex')
    profileEls.forEach(slideClose)
    logoutEls.forEach(slideClose)
    return
  }

  // ─── 4) AUTHORIZED (we have a valid user) ───────────────────────────────────
  // Hide the login button
  slideClose(loginContainerEl)

  // Expand each profile container (display:flex), then populate the data inside
  profileEls.forEach((el) => {
    slideOpen(el, 'flex')
  })
  // Populate avatar, name, email
  avatarEls.forEach((avatar) => {
    avatar.src = user.avatar_url
  })
  nameEls.forEach((nameEl) => {
    nameEl.innerText = user.name
  })
  emailEls.forEach((emailEl) => {
    emailEl.innerText = user.email
  })

  // Finally, expand the logout button(s)
  logoutEls.forEach((btn) => {
    slideOpen(btn, 'flex')
  })
}

/**
 * Called when Google Auth succeeds
 */
function onLoginSuccess(user) {
  render({ loading: false, error: null, unauthorized: false, user })
}

/**
 * Called when Google Auth fails
 */
function onLoginError(err) {
  render({ loading: false, error: err, unauthorized: true, user: null })
}

/**
 * Logout click handler: show spinner (by hiding everything),
 * call logout API, then re-render as “unauthorized”
 */
async function onLogoutClick() {
  // Disable all logout buttons visually (you could also show a spinner inside)
  els.logoutButtonElements().forEach((element) => {
    element.disabled = true
  })

  // Collapse everything while we wait
  render({ loading: true, error: null, unauthorized: false, user: null })

  try {
    await publicApiService.logout()
    // After successful logout → show login button only
    render({ loading: false, error: null, unauthorized: true, user: null })
  } catch (err) {
    // On error, re-enable logout button(s) and show error
    els.logoutButtonElements().forEach((element) => {
      element.disabled = false
    })
    render({ loading: false, error: err, unauthorized: true, user: null })
  }
}

/**
 * initUserComponent: entry point.
 * 1) Initialize element references.
 * 2) Render “loading” spinner.
 * 3) Fetch user profile.
 * 4) Render based on that result.
 * 5) Initialize Google Auth (for future logins).
 * 6) Add logout listeners.
 */
export async function initUserComponent(elementIds, elementClasses) {
  initElements(elementIds, elementClasses)

  // Show nothing (all collapsed) while we fetch
  render({ loading: true, error: null, unauthorized: false, user: null })

  const {
    data: user,
    status,
    error,
  } = await protectedApiService.getUserProfile()
  const unauthorized = status === 401 || status === 403

  // Render now that we have the API result
  render({ loading: false, error, unauthorized, user })

  // Set up Google Auth callbacks (for sign-in button)
  await initGoogleAuth(onLoginSuccess, onLoginError)

  // Attach logout click handlers
  els.logoutButtonElements().forEach((btn) => {
    btn.addEventListener('click', onLogoutClick)
  })
}
