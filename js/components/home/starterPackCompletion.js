// /components/home/starterPackCompletion.js
import { initGoogleAuth } from '../../service/oauth2/googleAuthService.js'
import eventService from '../../service/events/EventService.js'
import authService from '../../service/AuthService.js'
import { AuthEvent } from '../../constants/events.js'

let els = {}
let state = {
  mounted: false
}

/** Initialize elements dynamically using provided IDs */
function initElements() {
  els = {
    container: () => document.getElementById('starter-pack-completion-container'),
    signinCard: () => document.getElementById('starter-pack-signin-card'),
    welcomeCard: () => document.getElementById('starter-pack-welcome-card'),
    userNameLabel: () => document.getElementById('starter-pack-welcome-user-name'),
    googleSigninButton: () => document.getElementById('btn-starter-pack-google-signin'),
  }
}

/** Render completion cards based on auth state */
function render({ loading, error, unauthorized, user }) {
  // Don't render if not mounted
  if (!state.mounted || !els.container()) return

  // Show container
  els.container().style.display = 'block'

  // Loading state - hide both cards
  if (loading) {
    if (els.signinCard()) els.signinCard().style.display = 'none'
    if (els.welcomeCard()) els.welcomeCard().style.display = 'none'
    return
  }

  // Error or unauthorized - show signin card
  if (error || unauthorized || !user) {
    if (els.signinCard()) els.signinCard().style.display = 'block'
    if (els.welcomeCard()) els.welcomeCard().style.display = 'none'
  } else {
    // Authenticated - show welcome card with user name
    if (els.signinCard()) els.signinCard().style.display = 'none'
    if (els.welcomeCard()) els.welcomeCard().style.display = 'block'
    if (els.userNameLabel()) els.userNameLabel().textContent = user.name || 'User'
  }
}

/** Mount the starter pack completion component */
export function mountStarterPackCompletion() {
  if (state.mounted) return
  
  state.mounted = true
  
  // Initialize elements
  initElements()
  
  // Show initial loading state
  render({ loading: true })
  
  // Subscribe to auth events
  eventService.subscribe(AuthEvent.AUTH_STATE_CHANGED, (event) => {
    const { isLoading, hasError, unauthorized, user } = event.detail
    render({ 
      loading: isLoading, 
      error: hasError, 
      unauthorized, 
      user 
    })
  })
  
  // Initialize Google auth with unique button ID
  if (els.googleSigninButton()) {
    initGoogleAuth(
      'btn-starter-pack-google-signin',
      async (idToken) => await authService.googleSignin(idToken)
    )
  }
  
  // Get current auth state using existing methods
  const currentUser = authService.getCurrentUser()
  const isLoading = authService.getIsLoading()
  const isAuthenticated = authService.isAuthenticated()
  
  render({
    loading: isLoading,
    error: null,
    unauthorized: !isAuthenticated,
    user: currentUser
  })
}

/** Unmount the starter pack completion component */
export function unmountStarterPackCompletion() {
  if (!state.mounted) return
  
  // Hide container
  if (els.container()) {
    els.container().style.display = 'none'
  }
  
  // Cleanup event listeners
  eventService.unsubscribe(AuthEvent.AUTH_STATE_CHANGED)
  
  state.mounted = false
}
