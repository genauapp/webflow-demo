// /components/layout/signin.js
import { initGoogleAuth } from '../../service/oauth2/googleAuthService.js'
import authService from '../../service/AuthService.js'

let els = {}

function initElements(elementIds) {
  els = {
    modal: document.getElementById(elementIds.signinModal),
    googleButton: document.getElementById(elementIds.googleSigninButton),
  }
}

function render(isVisible) {
  if (!els.modal) return

  if (!isVisible) {
    els.modal.style.display = 'none'
  } else {
    els.modal.style.display = 'flex'
  }
}

export function initSigninComponent(elementIds) {
  initElements(elementIds)
  if (!els.modal || !els.googleButton) return

  initGoogleAuth(elementIds.googleSigninButton, async (idToken) => {
    await authService.googleSignin(idToken)

    const url = new URL(window.location.href)
    url.searchParams.set('signin-modal-successful', 'true')
    window.history.replaceState({}, '', url)
    window.location.reload()
  })

  // Initial render
  render(false)
}

export function showSigninModal() {
  render(true)
}

export function hideSigninModal() {
  render(false)
}
