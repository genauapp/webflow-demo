import { initUserComponent } from '../components/layout/user.js'
import authService from '../service/AuthService.js'

// "Single Element" IDs are kept in the page file
const elementIds = {
  // User component elements
  user: {
    loginContainer: 'login-container',
    googleSigninButton: 'btn-home-google-signin',
  },
}

// "Multiple Elements" Classes are kept in the page file
const elementClasses = {
  // User component elements appear in desktop/mobile
  user: {
    profileContainer: 'user-profile-container',
    avatar: 'image-user-info-avatar',
    name: 'label-user-info-name',
    email: 'label-user-info-email',
    logoutButton: 'btn-home-logout',
  },
}

async function bootstrap() {
  // Initialize both components with their respective element IDs
  await initUserComponent({ ...elementIds.user }, { ...elementClasses.user })

  // Initialize global auth service
  await authService.initialize()
}

document.addEventListener('DOMContentLoaded', bootstrap)
