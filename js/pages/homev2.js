import { initializeGoogleAuth } from '../service/oauth2/googleAuthService.js'

document.getElementById('google-signin').addEventListener('click', async () => {
  console.log('YAYYYYYYYYYYYYYYYY! Clicked!')
  // await initializeGoogleAuth(() => {
  //   console.log('YAYYYYYYYYYYYYYYYY! Logged in!')
  // })

  await initializeGoogleAuth(
    (userData) => {
      // e.g. redirect or store userData
      console.log('Logged in user:', userData)

      document.getElementById(
        'user-info'
      ).innerText = `Welcome ${userData.user.name} | ${userData.user.email}`
    },
    (error) => {
      // show notification
      console.error('Login error:', error)
    }
  )
})
