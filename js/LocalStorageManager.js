export default class LocalStorageManager {
  // Saves data to localStorage.
  // If data is an object (or array), it’s stringified.
  // For primitives (like numbers, booleans, or strings), it’s stored directly.
  static save(key, data) {
    let value
    if (typeof data === 'object' && data !== null) {
      value = JSON.stringify(data)
    } else {
      value = data
    }
    localStorage.setItem(key, value)
  }

  // Loads data from localStorage.
  // If the value can be parsed as JSON, it returns the parsed value.
  // Otherwise, it returns the raw value (which will be a string).
  static load(key, defaultValue) {
    const stored = localStorage.getItem(key)
    if (stored !== null) {
      try {
        // Try parsing; if it fails, we'll fall back to the raw value.
        return JSON.parse(stored)
      } catch (error) {
        return stored
      }
    }
    return defaultValue
  }

  // Removes data from localStorage
  static remove(key) {
    localStorage.removeItem(key)
  }
}
