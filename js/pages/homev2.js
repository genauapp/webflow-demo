import initializeGoogleAuth from '../service/oauth2/googleAuthService.js'

document.getElementById('google-signin').addEventListener('click', async () => {
  console.log('YAYYYYYYYYYYYYYYYY! Clicked!')
  await initializeGoogleAuth(() => {
    console.log('YAYYYYYYYYYYYYYYYY! Logged in!')
  })
})
