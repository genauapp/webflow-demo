import { logout } from '../service/authService.js'
import { initGoogleAuth } from '../service/oauth2/googleAuthService.js'
import { getUserProfile } from '../service/userService.js'

// Page bootstrap
document.addEventListener('DOMContentLoaded', async () => {
  const successHandler = async (result) => {
    console.log('Login successful:', result)

    // hide login container
    const loginContainer = document.getElementById('login-container')
    loginContainer.style.display = 'none'

    // show user info container
    const userProfileContainer = document.getElementById(
      'user-profile-container'
    )
    userProfileContainer.style.display = 'flex'

    // // populate user data for inner elements
    document.getElementById(
      'label-user-info-name'
    ).innerText = `${result.user.name}`
    document.getElementById(
      'label-user-info-email'
    ).innerText = `${result.user.email}`

    // todo: get user data with another request
    // const appUser = await getUserProfile()

    // document.getElementById(
    //   'app-user-info'
    // ).innerText = `Welcome App User!! ${appUser.name} | ${appUser.email}`

    // // todo: populate user progression
  }

  await initGoogleAuth(successHandler, (err) =>
    console.error('Login error:', err)
  )
})

document
  .getElementById('btn-home-logout')
  .addEventListener('click', async () => {
    const result = await logout()
    console.log(result)

    // hide user profile container
    // // todo: unpopulate user progression
    // // unpopulate user data for inner elements
    document.getElementById('label-user-info-name').innerText = ''
    document.getElementById('label-user-info-email').innerText = ''

    // hide user profile container
    const userProfileContainer = document.getElementById(
      'user-profile-container'
    )
    userProfileContainer.style.display = 'none'

    // show login container
    const loginContainer = document.getElementById('login-container')
    loginContainer.style.display = 'flex'
  })
