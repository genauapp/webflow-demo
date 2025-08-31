const API_KEY =
  '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'

let currentLevel = 'A1'
let wordList = []
let currentIndex = 0
// Seviye seçimi
function selectLevel(level) {
  currentLevel = level
  ;['A1', 'A2', 'B1', 'B2'].forEach((lvl) => {
    const btn = document.getElementById(`selectLevel-${lvl}`)
    if (btn) btn.classList.remove('active')
  })
  const selectedBtn = document.getElementById(`selectLevel-${level}`)
  if (selectedBtn) selectedBtn.classList.add('active')
}
// Refresh butonu
function refreshPack() {
  location.reload()
}
// Kart gösterme
function showCard(index) {
  const word = wordList[index]
  if (!word) return
  // Article ve kelimeyi birleştir
  const article = word.article || ''
  const wordDisplay = article ? `${article} ${word.german}` : word.german
  const articleClass =
    article === 'der'
      ? 'der'
      : article === 'die'
      ? 'die'
      : article === 'das'
      ? 'das'
      : ''
  document.getElementById('counter').innerText = `${index + 1}/${
    wordList.length
  }`
  const germanWordEl = document.getElementById('german-word')
  germanWordEl.innerText = wordDisplay
  // Renk atama
  if (article === 'der') {
    germanWordEl.style.color = '#3286C7' // lacivert
  } else if (article === 'die') {
    germanWordEl.style.color = '#C92523' // kırmızı
  } else if (article === 'das') {
    germanWordEl.style.color = '#5D891B' // yeşil
  } else {
    germanWordEl.style.color = ''
  }
  document.getElementById('translated-word').innerText = word.translation
  document.getElementById('example-sentence').innerText = word.example
  document.getElementById('word-type-label').innerText = word.type
  document.getElementById('rule-text').innerText = word.rule || ''
  const rulewrapper = document.getElementById('word-card-rule-container')
  const tagWrapper = document.getElementById('grammar-tags')
  // Önce tüm tag'leri gizle
  const tagIds = [
    'tag-modal',
    'tag-reflexive',
    'tag-accusative',
    'tag-dative',
    'tag-separable',
    'tag-impersonal',
  ]
  tagIds.forEach((id) => {
    const el = document.getElementById(id)
    if (el) el.style.display = 'none'
  })
  // Default olarak wrapper'ı da gizle
  if (tagWrapper) tagWrapper.style.display = 'none'
  if (rulewrapper) rulewrapper.style.display = 'flex'
  // Eğer verb ve case'leri varsa, ilgili tag'leri göster
  if (word.type === 'verb' && word.cases && word.cases.length > 0) {
    if (tagWrapper) tagWrapper.style.display = 'flex'
    word.cases.forEach((tag) => {
      const tagId = `tag-${tag}`
      const el = document.getElementById(tagId)
      if (el) el.style.display = 'flex'
    })
  }
  if (word.rule === '') {
    if (rulewrapper) rulewrapper.style.display = 'none'
  }
  // Butonlar
  const repeatBtn = document.getElementById('repeatBtn')
  const nextBtn = document.getElementById('nextBtn')
  if (repeatBtn && nextBtn) {
    repeatBtn.onclick = () => {
      wordList.push(wordList[currentIndex])
      currentIndex++
      if (currentIndex < wordList.length) {
        showCard(currentIndex)
      } else {
        document.getElementById('card-wrapper').innerHTML =
          ":tada: You've completed the pack!"
      }
    }
    nextBtn.onclick = () => {
      currentIndex++
      if (currentIndex < wordList.length) {
        showCard(currentIndex)
      } else {
        document.getElementById('card-wrapper').innerHTML =
          ":tada: You've completed the pack!"
      }
    }
  }
}
// Tag Emoji Fonksiyonu
function getTagEmoji(tag) {
  const emojis = {
    reflexive: ':arrows_anticlockwise:',
    separable: ':jigsaw:',
    accusative: ':dart:',
    dative: ':gift:',
    modal: ':brain:',
    impersonal: ':silhouette:',
  }
  return emojis[tag] || ''
}
// Capitalize
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
// Pack generate
async function generatePack() {
  console.log(':rocket: generatePack triggered')
  const prompt = document.getElementById('promptInput').value.trim()
  const loading = document.getElementById('loading')
  const output = document.getElementById('card-wrapper')
  loading.style.display = 'block'
  output.style.display = 'none'
  // Loading animasyonu alanına auto scroll
  const loadingDiv = document.getElementById('loading')
  if (loadingDiv)
    loadingDiv.scrollIntoView({ behavior: 'smooth', block: 'center' })
  const systemPrompt = `
You are a German vocabulary generator.
First, detect the language of the user's prompt.
Use that language as the translation output for each German word.
You must generate a mixed list of 14 German words that are commonly used in this context:
"**${prompt}**"
Each word should be of type: noun, verb, adjective, adverb, or preposition.
Return a JSON array where each object includes:
- german
- translation (in the same language as user input)
- level (must be "${currentLevel}")
- type (one of: "noun", "verb", "adjective", "adverb")
- example (in German)
- article (for nouns only)
- rule (only for nouns) based on the provided noun ending (see below) Do not write a rule for nouns that are exceptions to the ending/article pattern, even if the ending matches.
- cases (only for verbs, e.g. ["reflexive", "accusative"])
- category
If type is "noun":
- add "article"
- add "rule" only if article matches known suffixes:
  -ant, -ent, -er, -ich, -ismus, -ist, -ast → der;
  -heit, -keit, -schaft, -ung, -ie, -anz, -enz → die;
  -ment, -um, -tum, -chen, -ma, -em, -nis → das.
Format: "Nouns ending in '-XYZ' are usually [masculine/feminine/neuter]."
If no match, leave rule empty.
Return only JSON. No explanation or notes.
`
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'system', content: systemPrompt }],
        temperature: 0.7,
      }),
    })
    const data = await res.json()
    const text = data.choices[0].message.content
    try {
      wordList = JSON.parse(text)
      // :white_tick: Normalize ve filtreleme
      wordList = wordList.map((word) => {
        word.type = word.type?.toLowerCase()
        if (word.type !== 'noun') {
          word.rule = ''
          word.article = ''
        }
        if (word.type === 'verb') {
          word.cases = word.cases || []
        } else {
          word.cases = []
        }
        return word
      })
    } catch (e) {
      output.innerHTML = `<p>:x: Unexpected response from AI. Try again.</p><pre>${text}</pre>`
      loading.style.display = 'none'
      output.style.display = 'block'
      return
    }
    currentIndex = 0
    showCard(currentIndex)
    loading.style.display = 'none'
    output.style.display = 'block'
    const refreshBtn = document.getElementById('refreshButton')
    if (refreshBtn) refreshBtn.style.display = 'block'
  } catch (err) {
    output.innerHTML = `<p>:x: Error fetching word pack. Please try again.</p>`
    loading.style.display = 'none'
    output.style.display = 'block'
  }
}
document.addEventListener('DOMContentLoaded', function () {
  console.log(':package: JS loaded')
  ;['A1', 'A2', 'B1', 'B2'].forEach((level) => {
    const btn = document.getElementById(`selectLevel-${level}`)
    if (btn) {
      btn.addEventListener('click', function () {
        selectLevel(level)
      })
    }
  })
  const generateBtn = document.getElementById('generatePackBtn')
  if (generateBtn) {
    generateBtn.addEventListener('click', generatePack)
  }
  // Prompt input'ta enter'a basınca generatePack'i tetikle
  const promptInput = document.getElementById('promptInput')
  if (promptInput) {
    promptInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault()
        generatePack()
      }
    })
  }
  const refreshBtn = document.getElementById('refreshButton')
  if (refreshBtn) {
    refreshBtn.addEventListener('click', refreshPack)
    refreshBtn.style.display = 'none'
  }
})
