import protectedApi from '../api/protectedApi'
import publicApi from '../api/publicApi'

export const publicApiService = {
  googleSignin: (idToken) => {
    return handleRequest(() =>
      publicApi.post('/api/v1/auth/oauth2/google', {
        idToken,
      })
    )
  },

  logout: () => {
    return handleRequest(() => publicApi.post('/api/v1/auth/logout', {}))
  },
  getSearchResults: (query) => {
    return handleRequest(() =>
      publicApi.get(
        `/api/v1/bookmark/search?query=${encodeURIComponent(query)}`
      )
    )
  },
}

export const protectedApiService = {
  getUserProfile: () => {
    return handleRequest(() => protectedApi.get('/api/v1/user/me'))
  },
}

async function handleRequest(fetchCall) {
  try {
    const response = await fetchCall()
    const status = response.status
    let body,
      data = null,
      error = null

    try {
      body = await response.json()
      data = body.data ?? null
    } catch {
      // non-JSON or empty
    }

    if (!response.ok) {
      error = body?.error ?? 'Response is not OK!'
      return { data: null, status, error }
    }
    return { data, status, error: null }
  } catch (err) {
    console.error('Request failed:', err)
    return { data: null, status: null, error: err.message || err }
  }
}
