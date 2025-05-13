import { googleSignin } from '../authService'
import { GOOGLE_CLIENT_ID_WEB } from '../../constants/auth/google'

export function initializeGoogleAuth(onSuccess, onError) {
  window.onGoogleLibraryLoad = () => {
    // 1) Configure the client
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID_WEB,
      callback: handleCredentialResponse,
      context: 'use', // optional: ensures one‑tap context
      ux_mode: 'popup', // popup vs. redirect
    })

    // 2) Render the real button into your container
    google.accounts.id.renderButton(document.getElementById('google-signin'), {
      theme: 'outline',
      size: 'large',
    })
  }

  // 3) Load the library (ensures onGoogleLibraryLoad is called)
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.onload = () => window.onGoogleLibraryLoad()
  document.head.appendChild(script)

  async function handleCredentialResponse(response) {
    try {
      const idToken = response.credential // JWT from Google
      const result = await googleSignin(idToken)

      if (result.ok) {
        onSuccess(await result.json())
      } else {
        const errText = await result.text()
        console.error('Google login failed:', errText)
        onError(errText)
      }
    } catch (err) {
      console.error('Error in googleSignin request:', err)
      onError(err)
    }
  }
}
