import { DEFAULT_VALUE, WORD_LIST_KEY, CURRENT_CATEGORY_KEY, CURRENT_LEVEL_KEY, CURRENT_WORD_TYPE_KEY, LEARNED_WITH_LEARN_WORDS_KEY, TOTAL_WORD_LEARN_KEY } from "../../constants/storageKeys.js"
import LocalStorageManager from "../LocalStorageManager.js"
import { hideFinishScreen, showFinishScreen, updateFavoriteIcons } from "./UIUtils.js"


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

function refreshCasesUI() {
    let globalCases = ["reflexive, akkusativ, dativ, separable"]
    globalCases.forEach(caseName => {
        document.getElementById(`${caseName}-label`).style.display = "none"
    });
}

export default function showLearnWord() {
    const currentLevel = LocalStorageManager.load(CURRENT_LEVEL_KEY, DEFAULT_VALUE.CURRENT_LEVEL)
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE.CURRENT_WORD_TYPE)
    const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY, DEFAULT_VALUE.CURRENT_CATEGORY)
    const learnedWithLearnWords = LocalStorageManager.load(LEARNED_WITH_LEARN_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_LEARN_WORDS)
    let wordList = LocalStorageManager.load(WORD_LIST_KEY, DEFAULT_VALUE.WORD_LIST)
    const totalWordsLearn = LocalStorageManager.load(TOTAL_WORD_LEARN_KEY)
    const iKnowButton = document.getElementById(
        `iKnowButtonLearn-${wordType}`
    )
    const repeatButton = document.getElementById(
        `repeatButtonLearn-${wordType}`
    )

    if (learnedWithLearnWords[currentLevel][category][wordType].length === totalWordsLearn) {
        showFinishScreen()
        return
    }
    refreshCasesUI()
    hideFinishScreen()
    // else
    // // reactivate buttons
    iKnowButton.style.visibility = 'visible'
    repeatButton.style.visibility = 'visible'

    const { german, english, example, highlight, level, rule } =
        wordList[0]

    if (learnedWithLearnWords[currentLevel][category][wordType].length > 0) {
        wordList = wordList.filter(
            (word) =>
                !learnedWithLearnWords[currentLevel][category][wordType].some(
                    (learned) => learned.german === word.german
                )
        )
        LocalStorageManager.save(WORD_LIST_KEY, wordList)
    }

    switch (wordType) {
        case 'noun':
            // Highlight kısmını vurgula
            let highlightedWord = german
            if (highlight) {
                const regex = new RegExp(`(${highlight})`, 'i')
                highlightedWord = german.replace(
                    regex,
                    `<span class="highlight">$1</span>`
                )
            }
            const renk = artikelRenk(wordList[0].artikel)
            document.getElementById(
                'wordLearn-' + wordType
            ).innerHTML = `<span style="color: ${renk};">${highlightedWord}</span>`
            break
        case 'verb':
            document.getElementById('wordLearn-' + wordType).innerHTML = german
            let wordCases = wordList[0].cases
            let tagContainer = document.getElementById('verbTags-container')
            if(wordCases.length > 0) {
                tagContainer.style.display = "flex"
                wordCases.forEach(elem => {
                    document.getElementById(`${elem}-label`).style.display = "flex"
                });
            } else if (cases.length == 0) {
                tagContainer.style.display = "none"
            }
            break
        case 'adjective':
            document.getElementById('wordLearn-' + wordType).innerHTML = german
            break
        case 'adverb':
            document.getElementById('wordLearn-' + wordType).innerHTML = german
            break
    }

    document.getElementById(`remainingWordsCountLearn-${wordType}`).innerText = learnedWithLearnWords[currentLevel][category][wordType].length
    document.getElementById(`totalWordsCountLearn-${wordType}`).innerText = totalWordsLearn

    document.getElementById(`levelTagLearn-${wordType}`).innerText =
        level || 'N/A'
    document.getElementById('translationLearn-' + wordType).innerText =
        english || 'N/A'
    document.getElementById('exampleLearn-' + wordType).innerText =
        example || 'N/A'

    const ruleLearnElement = document.getElementById('ruleLearn-' + wordType)
    const isAdjectiveOrAdverb = wordType === 'adjective' || wordType === 'adverb'

    // rule setini göster
    if (!rule || isAdjectiveOrAdverb) {
        ruleLearnElement.innerText = ''
        ruleLearnElement.style.display = 'none'
    } else {
        ruleLearnElement.innerText = `${rule}`
        ruleLearnElement.style.display = 'block'

        // Animasyonu tekrar ettir
        ruleLearnElement.classList.remove('highlight-animation')
        void ruleLearnElement.offsetWidth // Bu satır animasyonu yeniden tetikler
        ruleLearnElement.classList.add('highlight-animation')
    }

    // Favori ikonlarını güncelle
    updateFavoriteIcons()
}