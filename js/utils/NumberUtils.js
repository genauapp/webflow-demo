export default class NumberUtils {
  static getRandomNumber = (max) => {
    // Ensure max is a non-negative number
    if (typeof max !== 'number' || max < 0) {
      throw new Error("The 'max' parameter must be a non-negative number.")
    }
    // Returns a random integer between 0 and max (inclusive)
    return Math.floor(Math.random() * (max + 1))
  }
}
