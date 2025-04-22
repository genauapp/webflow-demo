export function showModal(message, wordType) {
    var modal = document.getElementById(`customModal-${wordType}`)
    var modalMessage = document.getElementById(`modalMessage-${wordType}`)
    var closeButton = document.querySelector('.close-button')
  
    modalMessage.innerText = message // **Mesajı değiştir**
    modal.style.display = 'block' // **Modali aç**
  
    closeButton.addEventListener('click', function () {
      modal.style.display = 'none' // **Kapatma butonuna tıklanınca gizle**
      // resetLearnButtons(wordType) // **🔥 Butonları tekrar aktif et**
    })
  
    setTimeout(() => {
      modal.style.display = 'none' // **3 saniye sonra otomatik kapanır**
      // resetLearnButtons(wordType) // **🔥 Butonları tekrar aktif et**
    }, 3000)
  }
  
  export function showModalExercise(message, wordType) {
    var modal = document.getElementById(`customModalExercise-${wordType}`)
    var modalMessage = document.getElementById(
      `modalMessageExercise-${wordType}`
    )
    var closeButton = document.querySelector('.close-button')
  
    modalMessage.innerText = message // **Mesajı değiştir**
    modal.style.display = 'block' // **Modali aç**
  
    closeButton.addEventListener('click', function () {
      modal.style.display = 'none' // **Kapatma butonuna tıklanınca gizle**
      // resetExerciseButtons(wordType) // **🔥 Butonları tekrar aktif et**
    })
  
    setTimeout(() => {
      modal.style.display = 'none' // **3 saniye sonra otomatik kapanır**
      // resetExerciseButtons(wordType) // **🔥 Butonları tekrar aktif et**
    }, 3000)
  }