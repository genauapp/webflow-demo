// src/googleAuthPage.js
import { googleSignin } from '../authService.js'
import { GOOGLE_CLIENT_ID_WEB } from '../../constants/auth/google.js'

let initialized = false

/**
 * Load GSI script once
 */
async function loadGsi() {
  if (initialized) return
  await new Promise((res, rej) => {
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = s.defer = true
    s.onload = () => res()
    s.onerror = () => rej(new Error('Failed to load GSI script'))
    document.head.appendChild(s)
  })
  initialized = true
}

/**
 * Initialize Google Identity Services
 * @param {(loginRes: any) => Promise<void>} onSuccess
 * @param {(err: any) => void} onError
 */
export async function initGoogleAuth(onSuccess, onError) {
  await loadGsi()
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID_WEB,
    ux_mode: 'popup',
    callback: async (googlePopupResponse) => {
      try {
        const response = await googleSignin(googlePopupResponse.credential)
        if (!response) throw new Error('Empty login result')
        await onSuccess(response)
      } catch (err) {
        onError(err)
      }
    },
  })
}

/**
 * Attach prompt to given button
 * @param {string} buttonId
 */
export function addSigninEventTo(buttonId) {
  const btn = document.getElementById(buttonId)
  if (!btn) throw new Error(`#${buttonId} not found`)
  btn.addEventListener('click', () => google.accounts.id.prompt())
}
