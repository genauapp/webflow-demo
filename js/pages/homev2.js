import { initializeGoogleAuth } from '../service/oauth2/googleAuthService.js'
import { getUserProfile } from '../service/userService.js'

document.getElementById('google-signin').addEventListener('click', async () => {
  console.log('YAYYYYYYYYYYYYYYYY! Clicked!')
  // await initializeGoogleAuth(() => {
  //   console.log('YAYYYYYYYYYYYYYYYY! Logged in!')
  // })

  await initializeGoogleAuth(
    async (userData) => {
      // e.g. redirect or store userData
      console.log('Logged in user:', userData)

      document.getElementById(
        'google-user-info'
      ).innerText = `Welcome ${userData.user.name} | ${userData.user.email}`

      const appUser = await getUserProfile()

      document.getElementById(
        'app-user-info'
      ).innerText = `Welcome App User!! ${appUser.name} | ${appUser.email}`
    },
    (error) => {
      // show notification
      console.error('Login error:', error)
    }
  )
})
