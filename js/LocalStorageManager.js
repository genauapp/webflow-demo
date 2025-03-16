export default class LocalStorageManager {
  // Loads data from localStorage, returns the default if nothing found
  static load(key, defaultValue) {
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.error(`Error parsing ${key}:`, error)
      }
    }
    return defaultValue
  }

  // Saves data to localStorage
  static save(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
  }

  // Removes data from localStorage
  static remove(key) {
    localStorage.removeItem(key)
  }
}
