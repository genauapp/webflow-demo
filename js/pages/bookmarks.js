// import { BOOKMARKS_KEY, DEFAULT_VALUE } from '../constants/storageKeys.js'
import { protectedApiService } from '../service/apiService.js'
import LocalStorageManager from '../utils/LocalStorageManager.js'
import { mountBookmarkSearchList } from '../components/bookmarks/searchList.js'
import { showSigninModal, hideSigninModal, initSigninComponent } from '../components/layout/signin.js'
import eventService from '../service/events/EventService.js'
import { AuthEvent } from '../constants/events.js'

let bookmarkedWords = null

// On Initial Load
async function fetchAndRenderBookmarks() {
  LocalStorageManager.clearDeprecatedLocalStorageItems()

  try {
    const { data, error } = await protectedApiService.getAllBookmarkedWords()
    bookmarkedWords = error ? [] : data
  } catch {
    bookmarkedWords = []
  }

  // Ensure search UI container exists above bookmarks list
  let searchContainer = document.getElementById('bookmark-search-container')
  if (!searchContainer) {
    searchContainer = document.createElement('div')
    searchContainer.id = 'bookmark-search-container'
    const bookmarksContainer = document.getElementById('bookmarks-container')
    bookmarksContainer.parentNode.insertBefore(searchContainer, bookmarksContainer)
  }

  mountBookmarkSearchList(bookmarkedWords)
}

function handleAuthStateChanged({ unauthorized, user }) {
  if (unauthorized || !user) {
    showSigninModal()
    // Optionally clear bookmarks UI
    const bookmarksContainer = document.getElementById('bookmarks-container')
    if (bookmarksContainer) bookmarksContainer.innerHTML = ''
    return
  } else {
    hideSigninModal()
    fetchAndRenderBookmarks()
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Signin Component (modal and button)
  initSigninComponent({
    signinModal: 'modal-signin-container',
    googleSigninButton: 'btn-modal-google-signin',
  })
  // Subscribe to AuthEvent.AUTH_STATE_CHANGED using eventService
  eventService.subscribe(AuthEvent.AUTH_STATE_CHANGED, (event) => {
    handleAuthStateChanged(event.detail)
  })
})

// ...existing code...

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

// ...existing code...

// Sayfa yüklendiğinde favorileri listele
// document.addEventListener('DOMContentLoaded', listBookmarkedWords)
// document.addEventListener('DOMContentLoaded', listLearnedWords)
