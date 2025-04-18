import { DEFAULT_VALUE, WORD_LIST_KEY, CURRENT_CATEGORY_KEY, CURRENT_LEVEL_KEY, CURRENT_WORD_TYPE_KEY, LEARNED_WITH_LEARN_WORDS_KEY, CURRENT_LEARN_INDEX_KEY, TOTAL_WORD_LEARN_KEY } from "../../constants/storageKeys.js"
import LocalStorageManager from "../LocalStorageManager.js"
import { showFinishScreen, updateFavoriteIcons } from "./UIUtils.js"


export function artikelRenk(artikel) {
    if (artikel.toLowerCase() === 'der') {
        return 'blue'
    }
    if (artikel.toLowerCase() === 'die') {
        return 'red'
    }
    if (artikel.toLowerCase() === 'das') {
        return 'green'
    }
    return 'black'
}

export default function showLearnWord() {
    const level = LocalStorageManager.load(CURRENT_LEVEL_KEY, DEFAULT_VALUE.CURRENT_LEVEL)
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE.CURRENT_WORD_TYPE)
    const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY, DEFAULT_VALUE.CURRENT_CATEGORY)
    const learnedWithLearnWords = LocalStorageManager.load(LEARNED_WITH_LEARN_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_LEARN_WORDS)
    let wordList = LocalStorageManager.load(WORD_LIST_KEY, DEFAULT_VALUE.WORD_LIST)
    let currentLearnIndex = LocalStorageManager.load(CURRENT_LEARN_INDEX_KEY, DEFAULT_VALUE.CURRENT_LEARN_INDEX)
    const totalWordsLearn = LocalStorageManager.load(TOTAL_WORD_LEARN_KEY)

    const iKnowButton = document.getElementById(
        `iKnowButtonLearn-${wordType}`
    )
    const repeatButton = document.getElementById(
        `repeatButtonLearn-${wordType}`
    )

    if (learnedWithLearnWords[level][category][wordType].length === totalWordsLearn) {
        document.getElementById(`wordLearn-${wordType}`).innerText = ''
        document.getElementById(`wordLearn-${wordType}`).display = 'none'
        document.getElementById(`translationLearn-${wordType}`).innerText = ''
        document.getElementById(`translationLearn-${wordType}`).display = 'none'
        document.getElementById(`exampleLearn-${wordType}`).innerText = ''
        document.getElementById(`exampleLearn-${wordType}`).display = 'none'
        document.getElementById(`levelTagLearn-${wordType}`).innerText = ''
        document.getElementById(`levelTagLearn-${wordType}`).display = 'none'
        document.getElementById(`ruleLearn-${wordType}`).innerText = '' // Kural boş
        document.getElementById(`ruleLearn-${wordType}`).display = 'none'

        if (iKnowButton) {
            iKnowButton.style.visibility = 'hidden'
        }
        if (repeatButton) {
            repeatButton.style.visibility = 'hidden'
        }

        const inFavImage = document.getElementById(`infav-${wordType}`)
        const outFavImage = document.getElementById(`outfav-${wordType}`)

        inFavImage.display = 'none'
        outFavImage.display = 'none'

        showFinishScreen("learn")
        return
    }
    // else
    // // reactivate buttons
    iKnowButton.style.visibility = 'visible'
    repeatButton.style.visibility = 'visible'

    const { almanca, ingilizce, ornek, highlight, seviye, kural } =
        wordList[currentLearnIndex]

    if (learnedWithLearnWords[level][category][wordType].length > 0) {
        wordList = wordList.filter(
            (word) =>
                !learnedWithLearnWords[level][category][wordType].some(
                    (learned) => learned.almanca === word.almanca
                )
        )
        LocalStorageManager.save(WORD_LIST_KEY, wordList)
    }

    switch (wordType) {
        case 'noun':
            // Highlight kısmını vurgula
            let highlightedWord = almanca
            if (highlight) {
                const regex = new RegExp(`(${highlight})`, 'i')
                highlightedWord = almanca.replace(
                    regex,
                    `<span class="highlight">$1</span>`
                )
            }
            const renk = artikelRenk(wordList[currentLearnIndex].artikel)
            document.getElementById(
                'wordLearn-' + wordType
            ).innerHTML = `<span style="color: ${renk};">${highlightedWord}</span>`
            break
        case 'verb':
            document.getElementById('wordLearn-' + wordType).innerHTML = almanca
            break
        case 'adjective':
            document.getElementById('wordLearn-' + wordType).innerHTML = almanca
            break
        case 'adverb':
            document.getElementById('wordLearn-' + wordType).innerHTML = almanca
            break
    }

    document.getElementById(`levelTagLearn-${wordType}`).innerText =
        seviye || 'N/A'
    document.getElementById('translationLearn-' + wordType).innerText =
        ingilizce || 'N/A'
    document.getElementById('exampleLearn-' + wordType).innerText =
        ornek || 'N/A'

    const ruleLearnElement = document.getElementById('ruleLearn-' + wordType)
    const isAdjectiveOrAdverb = wordType === 'adjective' || wordType === 'adverb'

    // Kural setini göster
    if (!kural || isAdjectiveOrAdverb) {
        ruleLearnElement.innerText = ''
        ruleLearnElement.style.display = 'none'
    } else {
        ruleLearnElement.innerText = `${kural}`
        ruleLearnElement.style.display = 'block'

        // Animasyonu tekrar ettir
        ruleLearnElement.classList.remove('highlight-animation')
        void ruleLearnElement.offsetWidth // Bu satır animasyonu yeniden tetikler
        ruleLearnElement.classList.add('highlight-animation')
    }

    // Favori ikonlarını güncelle
    updateFavoriteIcons()
}