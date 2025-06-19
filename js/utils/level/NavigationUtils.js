class NavigationUtils {
  /** Generate options for grammar exercise */
  static generateGrammarOptions(correctWord, allWords, optionsCount) {
    const options = [correctWord]
    const otherWords = allWords.filter((w) => w.german !== correctWord.german)

    // Randomly select other German words
    while (options.length < optionsCount && options.length < allWords.length) {
      const randomWord =
        otherWords[Math.floor(Math.random() * otherWords.length)]
      if (!options.includes(randomWord)) {
        options.push(randomWord)
      }
    }

    // Shuffle the options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[options[i], options[j]] = [options[j], options[i]]
    }

    return options
  }

  /** Generate multiple choice options for a word */

  static generateVocabularyOptions(correctWord, allWords, optionsCount = null) {
    // Dynamic option count (2-4) if not specified
    if (optionsCount === null) {
      optionsCount = Math.floor(Math.random() * 3) + 2 // 2, 3, or 4 options
    }

    const options = [correctWord]
    const otherWords = allWords.filter((w) => w.german !== correctWord.german)

    // Randomly select other options
    while (options.length < optionsCount && options.length < allWords.length) {
      const randomWord =
        otherWords[Math.floor(Math.random() * otherWords.length)]
      if (!options.includes(randomWord)) {
        options.push(randomWord)
      }
    }

    // Shuffle the options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[options[i], options[j]] = [options[j], options[i]]
    }

    return options
  }

  /** Swap current word with another from the list */
  /** works with both learn and exercise modes thanks to shared structure and workflow */
  static getSwappedActiveOrder(
    activeOrder,
    currentIndex,
    candidates
  ) {
    // Guard: need at least two candidates to swap
    if (!Array.isArray(candidates) || candidates.length <= 1) {
      return activeOrder
    }

    const currentItem = activeOrder[currentIndex]
    // Exclude current from pickable set
    const others = candidates.filter((w) => w !== currentItem)
    if (others.length === 0) {
      return activeOrder
    }

    // Randomly pick one
    const picked = others[Math.floor(Math.random() * others.length)]
    const pickedIndex = activeOrder.indexOf(picked)

    // Build a shallow clone to avoid mutating the original
    const newOrder = activeOrder.slice()

    // Swap positions
    newOrder[currentIndex] = picked
    newOrder[pickedIndex] = currentItem

    return newOrder
  }
}

export default NavigationUtils
