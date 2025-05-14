// src/googleAuthPage.js
import { googleSignin } from '../authService.js'
import { GOOGLE_CLIENT_ID_WEB } from '../../constants/auth/google.js'

/**
 * Initializes Google Identity Services.
 * @param {Function} callback - credential response handler
 */
export function initializeGoogleAuth(callback) {
  window.onGoogleLibraryLoad = () => {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID_WEB,
      callback,
      context: 'use',
      ux_mode: 'popup',
    })
  }

  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.onload = () => window.onGoogleLibraryLoad()
  document.head.appendChild(script)
}

/**
 * Attaches click handler to your static Webflow button
 * @param {string} buttonId - DOM id of the sign-in button
 */
export function setupGoogleButton(buttonId) {
  const btn = document.getElementById(buttonId)
  if (!btn) throw new Error(`Element #${buttonId} not found`)
  btn.addEventListener('click', () => google.accounts.id.prompt())
  return btn
}

// /**
//  * Grabs your loading indicator element
//  * @param {string} loadingId - DOM id of the loading element
//  */
// export function setupLoadingIndicator(loadingId) {
//   const loadingEl = document.getElementById(loadingId)
//   if (!loadingEl) throw new Error(`Element #${loadingId} not found`)
//   return loadingEl
// }

/**
 * Creates a credential handler that manages loading state
 * @param {Function} onSuccess - async function called with user data on success
 * @param {Function} onError - called with error on failure
//  * @param {HTMLElement} loadingEl - loading indicator element
 */
export function createCredentialHandler(onSuccess, onError) {
  return async function handleCredentialResponse(response) {
    try {
      // show loading
      // loadingEl.style.display = 'block'

      const idToken = response.credential
      const user = await googleSignin(idToken)

      // hide loading
      // loadingEl.style.display = 'none'

      if (user) {
        // return the async onSuccess for chaining
        return await onSuccess(user)
      } else {
        throw new Error('Empty login result')
      }
    } catch (err) {
      // loadingEl.style.display = 'none'
      onError(err)
    }
  }
}
