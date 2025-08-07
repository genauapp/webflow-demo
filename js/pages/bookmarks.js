// import { BOOKMARKS_KEY, DEFAULT_VALUE } from '../constants/storageKeys.js'
import { protectedApiService } from '../service/apiService.js'
import LocalStorageManager from '../utils/LocalStorageManager.js'

let bookmarkedWords = null

// On Initial Load
document.addEventListener('DOMContentLoaded', async () => {
  LocalStorageManager.clearDeprecatedLocalStorageItems()

  const { data } = await protectedApiService.getAllBookmarkedWords()
  bookmarkedWords = data
})

async function listFavorites() {
  const favoritesContainer = document.getElementById('favoritesContainer')

  // FavoritesContainer için scrollable alan ayarları
  // favoritesContainer.style.maxHeight = '420px' // Maksimum yükseklik
  // favoritesContainer.style.overflowY = 'auto' // Dikey kaydırma
  // favoritesContainer.style.padding = '12px' // İçerik padding
  // favoritesContainer.style.border = '0px solid #ccc' // Çerçeve
  // favoritesContainer.style.borderRadius = '16px' // Köşeleri yuvarla
  // favoritesContainer.style.display = 'block' // Varsayılan düzen
  // favoritesContainer.style.display = 'flex' // Varsayılan düzen

  favoritesContainer.innerHTML = '' // Mevcut listeyi temizle

  // const bookmarkedWords = LocalStorageManager.load(
  //   BOOKMARKS_KEY,
  //   DEFAULT_VALUE.BOOKMARKS
  // )

  if (bookmarkedWords.length === 0) {
    // Favori word yokken gösterilecek mesaj
    showNoWordsMessage(favoritesContainer)
    return
  }

  // Favori wordler mevcutsa düzeni geri yükle
  // favoritesContainer.style.display = 'block' // Flex değil, varsayılan düzen
  favoritesContainer.style.display = 'flex' // Flex değil, varsayılan düzen

  bookmarkedWords.forEach((word) => {
    // Tüm favori bloğunu kapsayan div
    const wordContainer = document.createElement('div')
    // wordContainer.classList.add('favAllBlock')
    wordContainer.classList.add('bookmark-word-container')
    // wordContainer.style.display = 'flex'
    // wordContainer.style.justifyContent = 'space-between' // Yatayda aralık
    // wordContainer.style.alignItems = 'center' // Dikeyde ortalama
    // wordContainer.style.padding = '12px 0' // Bloklar arası boşluk
    // wordContainer.style.borderBottom = '1px solid #ccc' // Alt çizgi ile ayırma

    // german ve İngilizce wordler
    const wordLeftContainer = document.createElement('div')
    // wordLeftContainer.classList.add('wordLeftContainer')
    wordLeftContainer.classList.add('bookmark-word-left-container')
    // wordLeftContainer.style.display = 'flex'
    // wordLeftContainer.style.flexDirection = 'column' // Dikey hizalama
    // wordLeftContainer.style.textAlign = 'left' // Sola hizalama
    // wordLeftContainer.style.flex = '1' // Otomatik genişleme

    const germanWord = document.createElement('p')
    // germanWord.classList.add('favoriteWordGerman')
    germanWord.classList.add('bookmark-word-german')
    // germanWord.style.margin = '0' // Varsayılan margin sıfırlama
    // germanWord.style.fontWeight = 'bold' // Kalın yazı
    germanWord.textContent = word.german

    const englishWord = document.createElement('p')
    // englishWord.classList.add('favoriteWordEnglish')
    englishWord.classList.add('bookmark-word-german')
    // englishWord.style.margin = '4px 0 0 0' // Üstte boşluk
    englishWord.textContent = word.english

    wordLeftContainer.appendChild(germanWord)
    wordLeftContainer.appendChild(englishWord)

    // level ve silme butonu
    const wordRightContainer = document.createElement('div')
    // wordRightContainer.classList.add('favLevelBlock')
    wordRightContainer.classList.add('bookmark-word-right-container')
    // wordRightContainer.style.display = 'flex'
    // wordRightContainer.style.alignItems = 'center' // Dikeyde ortalama
    // wordRightContainer.style.gap = '8px' // Level ve buton arası boşluk

    const wordLevel = document.createElement('p')
    wordLevel.classList.add('bookmark-word-level')
    // wordLevel.style.margin = '0' // Varsayılan margin sıfırlama
    // wordLevel.style.color = '#999' // Gri renk
    wordLevel.textContent = word.level

    const wordType = document.createElement('p')
    wordType.classList.add('bookmark-word-type')
    // wordType.style.margin = '0'
    // wordType.style.color = '#999'
    wordType.textContent = word.type

    const removeButton = document.createElement('button')
    // removeButton.classList.add('removeButton')
    removeButton.classList.add('bookmark-word-remove-button')
    // removeButton.style.border = 'none'
    // removeButton.style.background = 'none'
    // removeButton.style.cursor = 'pointer'
    // removeButton.style.display = 'flex'
    // removeButton.style.alignItems = 'center' // İkon hizalama
    removeButton.innerHTML = '🗑️' // Çöp kutusu ikonu
    removeButton.onclick = () => removeFavorite(word.id)

    wordRightContainer.appendChild(wordType)
    wordRightContainer.appendChild(wordLevel)
    wordRightContainer.appendChild(removeButton)

    // Ana bloğa ekle
    wordContainer.appendChild(wordLeftContainer)
    wordContainer.appendChild(wordRightContainer)

    // Favoriler kapsayıcısına ekle
    favoritesContainer.appendChild(wordContainer)
  })
}

// Favori wordyi silme
function removeFavorite(wordId) {
  // let bookmarkedWords = LocalStorageManager.load(BOOKMARKS_KEY)

  const unbookmarkedWord = protectedApiService.removeFromBookmark(wordId)

  // const updatedBookmarkedWords = bookmarkedWords.splice(index, 1) // İlgili indeksi kaldır
  const removedBookmarkWordIndex = bookmarkedWords.findIndex(
    (bw) => bw.id === unbookmarkedWord.id
  )

  if (removedBookmarkWordIndex === -1) {
    return
  }

  const updatedBookmarkedWords = bookmarkedWords.splice(index, 1) // İlgili indeksi kaldır

  bookmarkedWords = updatedBookmarkedWords

  // LocalStorageManager.save(BOOKMARKS_KEY, bookmarkedWords)

  listFavorites() // Listeyi yeniden yükle
}

// function listLearnedWords() {
//   const learnedWordsContainer = document.getElementById('learnedWordsContainer')
//   const bookmarkedWords = LocalStorageManager.load(BOOKMARKS_KEY)
//   let learnedWords = bookmarkedWords.learned

//   // Container ayarları
//   learnedWordsContainer.style.maxHeight = '420px'
//   learnedWordsContainer.style.overflowY = 'auto'
//   learnedWordsContainer.style.padding = '12px'
//   learnedWordsContainer.style.border = '0px solid #ccc'
//   learnedWordsContainer.style.borderRadius = '16px'
//   learnedWordsContainer.style.display = 'block'
//   learnedWordsContainer.innerHTML = ''

//   // Eğer tüm word listeleri boşsa, mesaj göster
//   if (learnedWords.length === 0 || !learnedWords) {
//     showNoWordsMessage(learnedWordsContainer)
//     return
//   }

//   learnedWords.forEach((word) => {
//     // Öğrenilmiş wordler bloğunu kapsayan div
//     const learnedWordsAllBlock = document.createElement('div')
//     learnedWordsAllBlock.classList.add('learnedWordsAllBlock')
//     learnedWordsAllBlock.style.display = 'flex'
//     learnedWordsAllBlock.style.justifyContent = 'space-between'
//     learnedWordsAllBlock.style.alignItems = 'center'
//     learnedWordsAllBlock.style.padding = '12px 0'
//     learnedWordsAllBlock.style.borderBottom = '1px solid #ccc'

//     // word bilgilerini içeren div
//     const learnedWordsBlock = document.createElement('div')
//     learnedWordsBlock.classList.add('learnedWordsBlock')
//     learnedWordsBlock.style.display = 'flex'
//     learnedWordsBlock.style.flexDirection = 'column'
//     learnedWordsBlock.style.textAlign = 'left'
//     learnedWordsBlock.style.flex = '1'

//     const germanWord = document.createElement('p')
//     germanWord.classList.add('learnedWordGerman')
//     germanWord.style.margin = '0'
//     germanWord.style.fontWeight = 'bold'
//     germanWord.textContent = word.german

//     const englishWord = document.createElement('p')
//     englishWord.classList.add('learnedWordEnglish')
//     englishWord.style.margin = '4px 0 0 0'
//     englishWord.textContent = word.english

//     learnedWordsBlock.appendChild(germanWord)
//     learnedWordsBlock.appendChild(englishWord)

//     // level ve tip bilgisini gösteren blok
//     const learnedWordsLevelBlock = document.createElement('div')
//     learnedWordsLevelBlock.classList.add('wordRightContainer')
//     learnedWordsLevelBlock.style.display = 'flex'
//     learnedWordsLevelBlock.style.alignItems = 'center'
//     learnedWordsLevelBlock.style.gap = '8px'

//     const wordLevel = document.createElement('p')
//     wordLevel.classList.add('learnedWordLevel')
//     wordLevel.style.margin = '0'
//     wordLevel.style.color = '#999'
//     wordLevel.textContent = word.level

//     const wordType = document.createElement('p')
//     wordType.classList.add('favoriteWordType')
//     wordType.style.margin = '0'
//     wordType.style.color = '#999'
//     wordType.textContent = word.type

//     learnedWordsLevelBlock.appendChild(wordType)
//     learnedWordsLevelBlock.appendChild(wordLevel)

//     // Ana bloğa ekle
//     learnedWordsAllBlock.appendChild(learnedWordsBlock)
//     learnedWordsAllBlock.appendChild(learnedWordsLevelBlock)
//     learnedWordsContainer.appendChild(learnedWordsAllBlock)
//   })
// }

function showNoWordsMessage(elem) {
  elem.style.display = 'flex' // Flex düzen
  elem.style.justifyContent = 'center' // Yatayda ortala
  elem.style.alignItems = 'center' // Dikeyde ortala
  elem.style.textAlign = 'center' // Yazıları ortala

  const noWordsMessageElement = document.createElement('div')
  noWordsMessageElement.style.color = '#666' // Gri renk
  noWordsMessageElement.style.fontFamily = 'Montserrat, sans-serif' // Font ailesi
  noWordsMessageElement.style.fontSize = '16px' // Font boyutu
  noWordsMessageElement.style.fontWeight = '500' // Yazı kalınlığı
  noWordsMessageElement.style.padding = '16px' // Mesaj için padding
  noWordsMessageElement.style.lineHeight = '1.5' // Satır yüksekliği

  if (elem.id === 'learnedWordsContainer') {
    noWordsMessageElement.innerHTML = `
      <p>No words learned yet!</p>
      <p>Go to the "Exercise" and answer correctly a word three times in a row!!!</p>
    `
    elem.appendChild(noWordsMessageElement)
    return
  }

  if (elem.id === 'favoritesContainer') {
    noWordsMessageElement.innerHTML = `
      <p>No favorites added yet!</p>
      <p>Click the "Add to Favorites" button to start saving words 🌟</p>
    `

    elem.appendChild(noWordsMessageElement)
    return
  }
}

// Sayfa yüklendiğinde favorileri listele
document.addEventListener('DOMContentLoaded', listFavorites)
document.addEventListener('DOMContentLoaded', listLearnedWords)
