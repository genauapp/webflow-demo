import authFetch from '../api/authApi.js'

export async function googleSignin(idToken) {
  try {
    const response = await authFetch.post('/api/v1/auth/oauth2/google', {
      idToken,
    })
    if (response.ok) {
      // Cookies are automatically stored by the browser
      const responseBody = await response.json()
      console.log('Login response status code:', response.status)
      console.log('Login successful:', responseBody.data)
      return responseBody.data
    }
  } catch (error) {
    console.error('Login request failed:', error)
    return null
  }
}

export async function logout() {
  try {
    const response = await authFetch.post('/api/v1/auth/logout', {})
    if (response.ok) {
      // Cookies are automatically stored by the browser
      // const data = await response.json()
      const data = response // only string for now
      console.log('Logout response status code:', response.status)
      console.log('Logout successful:', data)
      return data
    }
  } catch (error) {
    console.error('Logout request failed:', error)
    return null
  }
}
