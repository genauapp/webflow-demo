import { GOOGLE_CLIENT_ID_WEB } from '../../constants/auth/google.js'

export async function initGoogleAuth(buttonId, onSuccess) {
  // 1) Load the library (ensures onGoogleLibraryLoad is called)
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.onload = () => window.onGoogleLibraryLoad()
  document.head.appendChild(script)

  window.onGoogleLibraryLoad = () => {
    // 2) Configure the client
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID_WEB,
      callback: handleCredentialResponse,
      context: 'use', // optional: ensures one‑tap context
      ux_mode: 'popup', // popup vs. redirect
    })

    // 3) Render the real button into your container
    google.accounts.id.renderButton(document.getElementById(buttonId), {
      theme: 'outline',
      size: 'large',
    })
  }

  async function handleCredentialResponse(googleResponse) {
    const idToken = googleResponse.credential // JWT from Google
    // console.log(`google id_token: ${idToken}`)
    await onSuccess(idToken)
  }
}
