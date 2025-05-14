import {
  initGoogleAuth,
  addSigninEventTo,
} from '../service/oauth2/googleAuthService.js'
import { getUserProfile } from '../service/userService.js'

// Page bootstrap
document.addEventListener('DOMContentLoaded', async () => {
  addSigninEventTo('btn-home-google-signin')

  const successHandler = async (loginRes) => {
    console.log('Login successful:', loginRes)

    // hide login container
    const loginContainer = document.getElementById('login-container')
    loginContainer.style.display = 'none'

    // show user info container
    const userInfoContainer = document.getElementById('user-info-container')
    userInfoContainer.style.display = 'flex'

    // // populate user data for inner elements
    document.getElementById(
      'label-user-info-name'
    ).innerText = `${loginRes.user.name}`
    document.getElementById(
      'label-user-info-email'
    ).innerText = `${loginRes.user.email}`

    // todo: get user data with another request
    // const appUser = await getUserProfile()

    // document.getElementById(
    //   'app-user-info'
    // ).innerText = `Welcome App User!! ${appUser.name} | ${appUser.email}`

    // show user progression container
    const userProgressionContainer = document.getElementById(
      'user-progression-container'
    )
    userProgressionContainer.style.display = 'flex'

    // // todo: populate user progression
  }

  await initGoogleAuth(successHandler, (err) =>
    console.error('Login error:', err)
  )
})
