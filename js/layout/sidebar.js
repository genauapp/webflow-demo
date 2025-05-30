import { initUserComponent } from '../components/home/user.js'

// "Single Element" IDs are kept in the page file
const elementIds = {
  // User component elements
  user: {
    login: 'login-container',
  },
}

// "Multiple Elements" Classes are kept in the page file
const elementClasses = {
  // User component elements appear in desktop/mobile
  user: {
    profile: 'user-profile-container',
    avatar: 'image-user-info-avatar',
    name: 'label-user-info-name',
    email: 'label-user-info-email',
    logoutButton: 'btn-home-logout',
  },
}

async function bootstrap() {
  // Initialize both components with their respective element IDs
  await initUserComponent({ ...elementIds.user }, { ...elementClasses.user })
}

document.addEventListener('DOMContentLoaded', bootstrap)
