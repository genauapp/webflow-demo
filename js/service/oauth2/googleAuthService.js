// src/googleAuthPage.js
import { googleSignin } from '../authService.js'
import { GOOGLE_CLIENT_ID_WEB } from '../../constants/auth/google.js'

let googleAuthInitialized = false
let googleClientReady = false

// Load GSI client with proper error handling
async function loadGoogleIdentityServices() {
  if (googleClientReady) return

  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      googleClientReady = true
      return resolve()
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      googleClientReady = true
      resolve()
    }
    script.onerror = () =>
      reject(new Error('Failed to load Google Identity Services'))
    document.head.appendChild(script)
  })
}

export async function initGoogleAuth(onSuccess, onError) {
  try {
    await loadGoogleIdentityServices()

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID_WEB,
      callback: async (response) => {
        if (response.error) {
          onError(response.error)
          return
        }

        try {
          const loginResult = await googleSignin(response.credential)
          await onSuccess(loginResult)
        } catch (error) {
          onError(error)
        }
      },
      error_callback: (error) => {
        onError(error)
      },
      ux_mode: 'popup',
      auto_select: false,
    })

    googleAuthInitialized = true
  } catch (error) {
    onError(error)
  }
}

export function addSigninEventTo(buttonId) {
  const button = document.getElementById(buttonId)
  if (!button) return

  button.addEventListener('click', () => {
    if (!googleAuthInitialized) {
      console.error('Google auth not initialized')
      return
    }

    try {
      // Use the proper prompt method for ID token flow
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Handle browser blocking or auto-sign-in failures
          console.warn(
            'Google sign-in prompt blocked:',
            notification.getNotDisplayedReason()
          )
        }
      })
    } catch (error) {
      console.error('Google sign-in error:', error)
    }
  })
}
