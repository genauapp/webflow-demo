import initializeGoogleAuth from '../service/oauth2/googleAuthService.js'

document.getElementById('google-signin').addEventListener('click', () => {
  initializeGoogleAuth(() => {
    console.log('YAYYYYYYYYYYYYYYYY! Logged in!')
  })
})
