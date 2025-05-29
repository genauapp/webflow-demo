import { initUserComponent } from '../components/home/user.js'

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
}

async function bootstrap() {
  // Initialize both components with their respective element IDs
  await initUserComponent({ ...elementIds.user })
}

document.addEventListener('DOMContentLoaded', bootstrap)
