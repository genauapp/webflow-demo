// /components/home/level.js

let els = {}

// Configuration for each level's packs
const levelPacks = {
  A1: [
    {
      title: 'A1 Basic Pack',
      image: '/images/a1-pack-1.jpg',
      pack: 1,
      type: 'basic',
    },
    {
      title: 'A1 Starter Pack',
      image: '/images/a1-pack-2.jpg',
      pack: 2,
      type: 'starter',
    },
    {
      title: 'A1 Essential Pack',
      image: '/images/a1-pack-3.jpg',
      pack: 3,
      type: 'essential',
    },
  ],
  A2: [
    {
      title: 'A2 Elementary Pack',
      image: '/images/a2-pack-1.jpg',
      pack: 1,
      type: 'elementary',
    },
    {
      title: 'A2 Progress Pack',
      image: '/images/a2-pack-2.jpg',
      pack: 2,
      type: 'progress',
    },
    {
      title: 'A2 Advanced Pack',
      image: '/images/a2-pack-3.jpg',
      pack: 3,
      type: 'advanced',
    },
    {
      title: 'A2 Complete Pack',
      image: '/images/a2-pack-4.jpg',
      pack: 4,
      type: 'complete',
    },
  ],
  B1: [
    {
      title: 'B1 Intermediate Pack',
      image: '/images/b1-pack-1.jpg',
      pack: 1,
      type: 'intermediate',
    },
    {
      title: 'B1 Plus Pack',
      image: '/images/b1-pack-2.jpg',
      pack: 2,
      type: 'plus',
    },
    {
      title: 'B1 Business Pack',
      image: '/images/b1-pack-3.jpg',
      pack: 3,
      type: 'business',
    },
  ],
  B2: [
    {
      title: 'B2 Upper Pack',
      image: '/images/b2-pack-1.jpg',
      pack: 1,
      type: 'upper',
    },
    {
      title: 'B2 Professional Pack',
      image: '/images/b2-pack-2.jpg',
      pack: 2,
      type: 'professional',
    },
    {
      title: 'B2 Expert Pack',
      image: '/images/b2-pack-3.jpg',
      pack: 3,
      type: 'expert',
    },
    {
      title: 'B2 Master Pack',
      image: '/images/b2-pack-4.jpg',
      pack: 4,
      type: 'master',
    },
    {
      title: 'B2 Premium Pack',
      image: '/images/b2-pack-5.jpg',
      pack: 5,
      type: 'premium',
    },
  ],
}

/** Initialize elements dynamically using provided IDs */
function initElements(elementIds) {
  els = {
    levelA1Btn: () => document.getElementById(elementIds.levelA1Btn),
    levelA2Btn: () => document.getElementById(elementIds.levelA2Btn),
    levelB1Btn: () => document.getElementById(elementIds.levelB1Btn),
    levelB2Btn: () => document.getElementById(elementIds.levelB2Btn),
    packsContainer: () => document.getElementById(elementIds.packsContainer),
  }
}

/** Get currently selected level from DOM */
function getCurrentLevel() {
  const selectedBtn = document.querySelector(
    '[data-level][data-selected="true"]'
  )
  return selectedBtn ? selectedBtn.getAttribute('data-level') : null
}

/** Remove selected state from all level buttons */
function clearLevelSelections() {
  const allLevelBtns = [
    els.levelA1Btn(),
    els.levelA2Btn(),
    els.levelB1Btn(),
    els.levelB2Btn(),
  ]

  allLevelBtns.forEach((btn) => {
    btn.removeAttribute('data-selected')
    btn.classList.remove('selected')
  })
}

/** Create pack image element with data attributes */
function createPackElement(pack, level) {
  const packEl = document.createElement('div')
  packEl.className = 'pack-image' // Webflow class style

  // Store pack data in data attributes
  packEl.setAttribute('data-level', level)
  packEl.setAttribute('data-pack', pack.pack)
  packEl.setAttribute('data-type', pack.type)
  packEl.setAttribute('data-pack-info', JSON.stringify({ level, ...pack }))

  const img = document.createElement('img')
  img.src = pack.image
  img.alt = pack.title
  img.className = 'pack-image-img'

  const title = document.createElement('h3')
  title.textContent = pack.title
  title.className = 'pack-image-title'

  packEl.appendChild(img)
  packEl.appendChild(title)

  // Add pack-summary-words-count-container element
  const wordsCount = pack.total_words_count || 0
  const wordsCountHTML = `
    <div id="Word_Count_Badge" class="w-layout-hflex pack-summary-words-count-container">
      <img src="https://cdn.prod.website-files.com/677da6ae8464f53ea15d73ac/683c7cefa0f6a98cfe516c78_WordsIcon.svg" loading="lazy" alt="" class="image-21">
      <div class="w-layout-hflex pack-summary-words-count">
        <div id="Word_Count_Text" class="words-count-label">${wordsCount}</div>
      </div>
    </div>
  `
  packEl.insertAdjacentHTML('beforeend', wordsCountHTML)

  // Add click handler
  packEl.addEventListener('click', () => onPackClick(packEl))

  return packEl
}

/** Handle pack selection */
function onPackClick(packEl) {
  console.log('Pack selected:', packEl.getAttribute('data-pack-info'))

  // Remove selected state from all packs
  document.querySelectorAll('.pack-image').forEach((el) => {
    el.removeAttribute('data-selected')
    el.classList.remove('selected')
  })

  // Mark this pack as selected
  packEl.setAttribute('data-selected', 'true')
  packEl.classList.add('selected')

  // Save to localStorage
  const packInfo = packEl.getAttribute('data-pack-info')
  localStorage.setItem('selectedPack', packInfo)

  console.log('Pack data saved to localStorage')
}

/** Render packs for selected level */
function renderPacks(level) {
  const container = els.packsContainer()

  // Clear existing packs and their selections
  container.innerHTML = ''

  // Get packs for the selected level
  const packs = levelPacks[level]
  if (!packs) return

  // Create and append pack elements
  packs.forEach((pack) => {
    const packEl = createPackElement(pack, level)
    container.appendChild(packEl)
  })

  console.log(`Rendered ${packs.length} packs for level ${level}`)
}

/** Handle level button click */
function onLevelClick(level) {
  console.log('Level selected:', level)

  // Clear all level selections
  clearLevelSelections()

  // Get the button for this level and mark it as selected
  const levelBtn = getLevelButton(level)
  if (levelBtn) {
    levelBtn.setAttribute('data-selected', 'true')
    levelBtn.classList.add('selected')
  }

  // Render packs for selected level (this clears previous pack selections)
  renderPacks(level)

  // Save current level to localStorage
  localStorage.setItem('currentLevel', level)

  console.log(`Level ${level} activated`)
}

/** Get level button element by level name */
function getLevelButton(level) {
  switch (level) {
    case 'A1':
      return els.levelA1Btn()
    case 'A2':
      return els.levelA2Btn()
    case 'B1':
      return els.levelB1Btn()
    case 'B2':
      return els.levelB2Btn()
    default:
      return null
  }
}

/** Load saved state from localStorage */
function loadSavedState() {
  const savedLevel = localStorage.getItem('currentLevel')
  const savedPack = localStorage.getItem('selectedPack')

  if (savedLevel && levelPacks[savedLevel]) {
    // Restore the level selection
    onLevelClick(savedLevel)

    // If there's a saved pack, restore that selection too
    if (savedPack) {
      try {
        const packData = JSON.parse(savedPack)

        // Small delay to ensure packs are rendered first
        setTimeout(() => {
          const packEl = document.querySelector(
            `[data-level="${packData.level}"][data-pack="${packData.pack}"][data-type="${packData.type}"]`
          )
          if (packEl) {
            packEl.setAttribute('data-selected', 'true')
            packEl.classList.add('selected')
            console.log('Restored pack selection:', packData)
          }
        }, 100)
      } catch (e) {
        console.warn('Could not parse saved pack data:', e)
      }
    }
  }
}

/** Initialize the level component */
export function initLevelComponent(elementIds) {
  // Initialize elements with provided IDs
  initElements(elementIds)

  // Set data-level attributes on level buttons for identification
  els.levelA1Btn().setAttribute('data-level', 'A1')
  els.levelA2Btn().setAttribute('data-level', 'A2')
  els.levelB1Btn().setAttribute('data-level', 'B1')
  els.levelB2Btn().setAttribute('data-level', 'B2')

  // Add event listeners to level buttons
  els.levelA1Btn().addEventListener('click', () => onLevelClick('A1'))
  els.levelA2Btn().addEventListener('click', () => onLevelClick('A2'))
  els.levelB1Btn().addEventListener('click', () => onLevelClick('B1'))
  els.levelB2Btn().addEventListener('click', () => onLevelClick('B2'))

  // Load any saved state
  loadSavedState()

  console.log('Level component initialized')
}
