class StringUtils {
  // tiny helper to capitalize any word
  static capitalize(word) {
    return word[0].toUpperCase() + word.slice(1)
  }
}

export default StringUtils
