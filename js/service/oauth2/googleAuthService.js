// googleAuthService.js
import { googleSignin } from '../authService.js'
import { GOOGLE_CLIENT_ID_WEB } from '../../constants/auth/google.js'

let googleClientReady = false
let loginPromise = null

async function loadFedCM() {
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
    await loadFedCM()

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID_WEB,
      callback: async (response) => {
        try {
          const loginRes = await googleSignin(response.credential)
          await onSuccess(loginRes)
          loginPromise = null
        } catch (error) {
          onError(error)
          loginPromise = null
        }
      },
      error_callback: (error) => {
        onError(error)
        loginPromise = null
      },
      ux_mode: 'redirect',
      context: 'use',
      auto_select: false,
    })
  } catch (error) {
    onError(error)
  }
}

export function addSigninEventTo(buttonId) {
  const button = document.getElementById(buttonId)
  if (!button) return

  button.addEventListener('click', async () => {
    if (!window.google?.accounts?.id) {
      console.error('Google client not loaded')
      return
    }

    if (loginPromise) return

    try {
      loginPromise = new Promise((resolve, reject) => {
        google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            reject(
              new Error(
                `Prompt blocked: ${notification.getNotDisplayedReason()}`
              )
            )
          } else if (notification.isSkippedMoment()) {
            reject(
              new Error(`Prompt skipped: ${notification.getSkippedReason()}`)
            )
          } else if (notification.isDismissedMoment()) {
            reject(new Error('Prompt dismissed'))
          }
        })
      })

      await loginPromise
    } catch (error) {
      console.error('FedCM sign-in error:', error)
      loginPromise = null
    }
  })
}
