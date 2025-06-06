import { protectedApiService } from '../../service/apiService.js'
import { initGoogleAuth } from '../../service/oauth2/googleAuthService.js'

let els = {}
let state = {
  loading: false,
  error: null,
  user: null,
  isVisible: false
}

function initElements(elementIds) {
  els = {
    modal: document.getElementById(elementIds.signinModal),
    googleButton: document.getElementById(elementIds.googleSigninButton)
  }
}

function render() {
  if (!els.modal) return;
  
  if (state.user) {
    els.modal.style.display = 'none';
  } else {
    els.modal.style.display = state.isVisible ? 'flex' : 'none';
  }
}

function setState(newState) {
  state = { ...state, ...newState };
  render();
}

function onLoginSuccess(user) {
  setState({ user, isVisible: false });
  
  const url = new URL(window.location.href);
  url.searchParams.set('signin-modal-successful', 'true');
  window.history.replaceState({}, '', url);
  window.location.reload();
}

function onLoginError(err) {
  setState({ error: err, user: null });
}

export async function initSigninComponent(elementIds) {
  initElements(elementIds);
  if (!els.modal || !els.googleButton) return;
  
  setState({ loading: true });

  try {
    const { data: user } = await protectedApiService.getUserProfile();
    setState({ user, loading: false });
  } catch (error) {
    const unauthorized = error.status === 401 || error.status === 403;
    setState({ error, loading: false, user: null });
  }

  await initGoogleAuth(
    elementIds.googleSigninButton,
    onLoginSuccess,
    onLoginError
  );
  
  // Initial render
  render();
}

export function showSigninModal() {
  if (!state.user) setState({ isVisible: true });
}

export function hideSigninModal() {
  setState({ isVisible: false });
}