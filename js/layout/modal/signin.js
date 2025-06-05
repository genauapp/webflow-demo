import { initSigninComponent } from "../../components/layout/signin.js"

// "Single Element" IDs are kept in the page file
const elementIds = {
  // User component elements
  signin: {
    signinModal: 'modal-signin-container',
    googleSigninButton: 'btn-modal-google-signin',
  },
}

async function bootstrap() {
  // Initialize both components with their respective element IDs
  await initSigninComponent({ ...elementIds.user })
}

document.addEventListener('DOMContentLoaded', bootstrap)
