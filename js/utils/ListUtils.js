export class ListUtils {
  static shuffleArray = (arr) => {
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      // Using a temporary variable to swap elements
      const temp = shuffled[i]
      shuffled[i] = shuffled[j]
      shuffled[j] = temp
    }
    return shuffled
  }

  static getRandomItems = (arr, count) => {
    // Shuffle first, then take the first 'count' items
    return ListUtils.shuffleArray(arr).slice(0, count)
  }
}
