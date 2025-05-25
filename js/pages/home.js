// /pages/home.js
import { initUserComponent } from '../components/home/user.js'
import { initSearchComponent } from '../components/home/search.js'

// Element IDs are kept in the page file
const elementIds = {
  // User component elements
  user: {
    login: 'login-container',
    profile: 'user-profile-container',
    avatar: 'image-user-info-avatar',
    name: 'label-user-info-name',
    email: 'label-user-info-email',
    logoutBtn: 'btn-home-logout',
  },

  // Search component elements
  search: {
    searchForm: 'search-form',
    searchInput: 'search-input',
    searchButton: 'search-button',
    searchSpinner: 'search-spinner',
    searchError: 'search-error',
    searchEmpty: 'search-empty',
    searchResults: 'search-results',
  },
}

async function bootstrap() {
  // Initialize both components with their respective element IDs
  await initUserComponent({ ...elementIds.user })
  initSearchComponent({ ...elementIds.search })
}

document.addEventListener('DOMContentLoaded', bootstrap)
