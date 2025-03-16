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
    let value
    if (typeof data === 'object' && data !== null) {
      // Objects, arrays, and null will be serialized to JSON
      value = JSON.stringify(data)
    } else {
      // Primitives (string, number, boolean) are stored directly
      value = String(data)
    }
    localStorage.setItem(key, value)
  }

  // Removes data from localStorage
  static remove(key) {
    localStorage.removeItem(key)
  }
}
