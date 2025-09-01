class StringUtils {
  // tiny helper to capitalize any word
  static capitalize(word) {
    return word[0].toUpperCase() + word.slice(1)
  }
  // Capitalize every word in a string
  static capitalizeWords(str) {
    return str.split(' ').map(word => word.toLowerCase() === 'and' ? word.toLowerCase() : this.capitalize(word)).join(' ');
  }
}

export default StringUtils
