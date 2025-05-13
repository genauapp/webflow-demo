import { authFetch } from '../../api/authApi'
import { GOOGLE_CLIENT_ID_WEB } from '../../constants/auth/google'
import { googleSignin } from '../authService'

const initializeGoogleAuth = (onSuccess) => {
  // Load Google client library
  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID_WEB,
    callback: async (response) => {
      try {
        // Send ID token to your backend
        // const result = await fetch('/api/v1/auth/oauth2/google', {
        //   method: 'POST',
        //   credentials: 'include', // For cookies
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ id_token: response.credential }),
        // })

        const result = await googleSignin(response.credential)

        if (result.ok) {
          onSuccess()
        } else {
          console.error('Authentication failed:', await result.text())
        }
      } catch (error) {
        console.error('Request error:', error)
      }
    },
  })

  // Add click handler to your custom button
  document.getElementById('googleSignInBtn').addEventListener('click', () => {
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkipped()) {
        // Fallback if prompt doesn't show
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInBtn'),
          { theme: 'filled_blue', size: 'large', type: 'standard' }
        )
      }
    })
  })
}

export default initializeGoogleAuth
