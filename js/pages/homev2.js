document.getElementById('google-signin').addEventListener('click', () => {
  initializeGoogleAuth(() => {
    console.log('YAYYYYYYYYYYYYYYYY! Logged in!')
  })
})
