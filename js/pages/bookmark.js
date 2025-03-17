import LocalStorageManager from '../LocalStorageManager.js'
import { learnedWithExerciseWords, levels, types } from '../footer.js'

function listFavorites() {
  const favoritesContainer = document.getElementById('favoritesContainer')

  // FavoritesContainer için scrollable alan ayarları
  favoritesContainer.style.maxHeight = '420px' // Maksimum yükseklik
  favoritesContainer.style.overflowY = 'auto' // Dikey kaydırma
  favoritesContainer.style.padding = '12px' // İçerik padding
  favoritesContainer.style.border = '0px solid #ccc' // Çerçeve
  favoritesContainer.style.borderRadius = '16px' // Köşeleri yuvarla
  favoritesContainer.style.display = 'block' // Varsayılan düzen

  favoritesContainer.innerHTML = '' // Mevcut listeyi temizle

  const favoriteWords = JSON.parse(localStorage.getItem('favoriteWords')) || []

  if (favoriteWords.length === 0) {
    // Favori kelime yokken gösterilecek mesaj
    favoritesContainer.style.display = 'flex' // Flex düzen
    favoritesContainer.style.justifyContent = 'center' // Yatayda ortala
    favoritesContainer.style.alignItems = 'center' // Dikeyde ortala
    favoritesContainer.style.textAlign = 'center' // Yazıları ortala

    const noFavoritesMessage = document.createElement('div')
    noFavoritesMessage.style.color = '#666' // Gri renk
    noFavoritesMessage.style.fontFamily = 'Montserrat, sans-serif' // Font ailesi
    noFavoritesMessage.style.fontSize = '16px' // Font boyutu
    noFavoritesMessage.style.fontWeight = '500' // Yazı kalınlığı
    noFavoritesMessage.style.padding = '16px' // Mesaj için padding
    noFavoritesMessage.style.lineHeight = '1.5' // Satır yüksekliği
    noFavoritesMessage.innerHTML = `
      <p>No favorites added yet!</p>
      <p>Click the "Add to Favorites" button to start saving words 🌟</p>
    `

    favoritesContainer.appendChild(noFavoritesMessage)
    return
  }

  // Favori kelimeler mevcutsa düzeni geri yükle
  favoritesContainer.style.display = 'block' // Flex değil, varsayılan düzen

  favoriteWords.forEach((word, index) => {
    // Tüm favori bloğunu kapsayan div
    const favAllBlock = document.createElement('div')
    favAllBlock.classList.add('favAllBlock')
    favAllBlock.style.display = 'flex'
    favAllBlock.style.justifyContent = 'space-between' // Yatayda aralık
    favAllBlock.style.alignItems = 'center' // Dikeyde ortalama
    favAllBlock.style.padding = '12px 0' // Bloklar arası boşluk
    favAllBlock.style.borderBottom = '1px solid #ccc' // Alt çizgi ile ayırma

    // Almanca ve İngilizce kelimeler
    const favWordsBlock = document.createElement('div')
    favWordsBlock.classList.add('favWordsBlock')
    favWordsBlock.style.display = 'flex'
    favWordsBlock.style.flexDirection = 'column' // Dikey hizalama
    favWordsBlock.style.textAlign = 'left' // Sola hizalama
    favWordsBlock.style.flex = '1' // Otomatik genişleme

    const germanWord = document.createElement('p')
    germanWord.classList.add('favoriteWordGerman')
    germanWord.style.margin = '0' // Varsayılan margin sıfırlama
    germanWord.style.fontWeight = 'bold' // Kalın yazı
    germanWord.textContent = word.almanca

    const englishWord = document.createElement('p')
    englishWord.classList.add('favoriteWordEnglish')
    englishWord.style.margin = '4px 0 0 0' // Üstte boşluk
    englishWord.textContent = word.ingilizce

    favWordsBlock.appendChild(germanWord)
    favWordsBlock.appendChild(englishWord)

    // Seviye ve silme butonu
    const favLevelBlock = document.createElement('div')
    favLevelBlock.classList.add('favLevelBlock')
    favLevelBlock.style.display = 'flex'
    favLevelBlock.style.alignItems = 'center' // Dikeyde ortalama
    favLevelBlock.style.gap = '8px' // Level ve buton arası boşluk

    const levelTag = document.createElement('p')
    levelTag.classList.add('favoriteWordLevel')
    levelTag.style.margin = '0' // Varsayılan margin sıfırlama
    levelTag.style.color = '#999' // Gri renk
    levelTag.textContent = word.seviye

    const typeTag = document.createElement('p')
    typeTag.classList.add('favoriteWordType')
    typeTag.style.margin = '0'
    typeTag.style.color = '#999'
    typeTag.textContent = word.type

    const removeButton = document.createElement('button')
    removeButton.classList.add('removeButton')
    removeButton.style.border = 'none'
    removeButton.style.background = 'none'
    removeButton.style.cursor = 'pointer'
    removeButton.style.display = 'flex'
    removeButton.style.alignItems = 'center' // İkon hizalama
    removeButton.innerHTML = '🗑️' // Çöp kutusu ikonu
    removeButton.onclick = () => removeFavorite(index)

    favLevelBlock.appendChild(typeTag)
    favLevelBlock.appendChild(levelTag)
    favLevelBlock.appendChild(removeButton)

    // Ana bloğa ekle
    favAllBlock.appendChild(favWordsBlock)
    favAllBlock.appendChild(favLevelBlock)

    // Favoriler kapsayıcısına ekle
    favoritesContainer.appendChild(favAllBlock)
  })
}

// Favori kelimeyi silme
function removeFavorite(index) {
  let favoriteWords = JSON.parse(localStorage.getItem('favoriteWords')) || []
  favoriteWords.splice(index, 1) // İlgili indeksi kaldır
  localStorage.setItem('favoriteWords', JSON.stringify(favoriteWords))
  listFavorites() // Listeyi yeniden yükle
}

function createElementWithStyle(tag, className, styles = {}, textContent = '') {
  const el = document.createElement(tag)
  if (className) el.classList.add(className)
  Object.assign(el.style, styles)
  if (textContent) el.textContent = textContent
  return el
}

function listLearnedWords() {
  const learnedWordsContainer = document.getElementById('learnedWordsContainer')

  // learnedWordsContainer için scrollable alan ayarları
  learnedWordsContainer.style.maxHeight = '420px' // Maksimum yükseklik
  learnedWordsContainer.style.overflowY = 'auto' // Dikey kaydırma
  learnedWordsContainer.style.padding = '12px' // İçerik padding
  learnedWordsContainer.style.border = '0px solid #ccc' // Çerçeve
  learnedWordsContainer.style.borderRadius = '16px' // Köşeleri yuvarla
  learnedWordsContainer.style.display = 'block' // Varsayılan düzen

  learnedWordsContainer.innerHTML = '' // Mevcut listeyi temizle

  const learnedWithExerciseWords = JSON.parse(
    LocalStorageManager.load(
      'learnedWithExerciseWords',
      learnedWithExerciseWords
    )
  )

  const allEmpty = levels.every((level) =>
    types.every((type) => learnedWithExerciseWords[level][type].length === 0)
  )

  if (allEmpty) {
    // Learned words  yokken gösterilecek mesaj
    learnedWordsContainer.style.display = 'flex' // Flex düzen
    learnedWordsContainer.style.justifyContent = 'center' // Yatayda ortala
    learnedWordsContainer.style.alignItems = 'center' // Dikeyde ortala
    learnedWordsContainer.style.textAlign = 'center' // Yazıları ortala

    const noLearnedWordsMessage = document.createElement('div')
    noLearnedWordsMessage.style.color = '#666' // Gri renk
    noLearnedWordsMessage.style.fontFamily = 'Montserrat, sans-serif' // Font ailesi
    noLearnedWordsMessage.style.fontSize = '16px' // Font boyutu
    noLearnedWordsMessage.style.fontWeight = '500' // Yazı kalınlığı
    noLearnedWordsMessage.style.padding = '16px' // Mesaj için padding
    noLearnedWordsMessage.style.lineHeight = '1.5' // Satır yüksekliği
    noLearnedWordsMessage.innerHTML = `
    <p>No words learned yet!</p>
    <p>Go to the "Exercise" and answer correctly a word three times in a row!!!</p>
  `

    learnedWordsContainer.appendChild(noLearnedWordsMessage)
    return
  }

  Object.keys(learnedWithExerciseWords).forEach(levelKey => {
    const levelObj = learnedWithExerciseWords[levelKey];
  
    // Iterate over each word type (e.g., noun, verb, etc.)
    Object.keys(levelObj).forEach(typeKey => {
      const wordsArray = levelObj[typeKey];
  
      wordsArray.forEach(word => {
        console.log('Processing word from', levelKey, typeKey, word);
  
        // Show container if there are any words
        learnedWordsContainer.style.display = 'block';
  
        // Main block for each word entry
        const learnedWordsAllBlock = createElementWithStyle('div', 'learnedWordsAllBlock', {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 0',
          borderBottom: '1px solid #ccc'
        });
  
        // Block for German and English words
        const learnedWordsBlock = createElementWithStyle('div', 'learnedWordsBlock', {
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'left',
          flex: '1'
        });
  
        const germanWord = createElementWithStyle('p', 'learnedWordGerman', {
          margin: '0',
          fontWeight: 'bold'
        }, word.almanca);
  
        const englishWord = createElementWithStyle('p', 'learnedWordEnglish', {
          margin: '4px 0 0 0'
        }, word.ingilizce);
  
        learnedWordsBlock.append(germanWord, englishWord);
  
        // Block for type and level information
        const learnedWordsLevelBlock = createElementWithStyle('div', 'favLevelBlock', {
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        });
  
        const typeTag = createElementWithStyle('p', 'favoriteWordType', {
          margin: '0',
          color: '#999'
        }, typeKey);
  
        const levelTag = createElementWithStyle('p', 'learnedWordLevel', {
          margin: '0',
          color: '#999'
        }, word.seviye);
  
        learnedWordsLevelBlock.append(typeTag, levelTag);
  
        // Combine blocks into the overall block and append to container
        learnedWordsAllBlock.append(learnedWordsBlock, learnedWordsLevelBlock);
        learnedWordsContainer.appendChild(learnedWordsAllBlock);
      });
    });
  });
}

// Sayfa yüklendiğinde favorileri listele
document.addEventListener('DOMContentLoaded', listFavorites)
document.addEventListener('DOMContentLoaded', listLearnedWords)
