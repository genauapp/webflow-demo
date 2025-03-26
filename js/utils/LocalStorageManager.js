export default class LocalStorageManager {
  /**
   * Save data to localStorage under the given key.
   *
   * The function handles different data types:
   *
   * 1. **Objects and Arrays**:
   *    - If data is an object (or array) and not null, it is serialized using JSON.stringify.
   *
   * 2. **Strings**:
   *    - For strings, we check if the string appears to be valid JSON by checking if it starts with
   *      '{' or '[' (and correspondingly ends with '}' or ']').
   *    - We attempt to parse it. If parsing is successful, we assume the string is already a JSON string and
   *      store it as is, to avoid double-stringification.
   *    - Otherwise, we treat it as a plain string.
   *
   * 3. **Other Primitives (numbers, booleans, etc.)**:
   *    - They are stored directly.
   *
   * **Important:**
   * Make sure you pass raw data (objects, arrays, or plain primitives) into this method. If you pre-stringify the data,
   * this function might end up stringifying it again, causing issues on load.
   *
   * @param {string} key - The key under which the data will be stored.
   * @param {*} data - The data to store. It can be an object, array, string, number, or boolean.
   */
  static save(key, data) {
    let value
    if (typeof data === 'object' && data !== null) {
      // For objects and arrays, use JSON.stringify to serialize the data.
      value = JSON.stringify(data)
    } else if (typeof data === 'string') {
      const trimmed = data.trim()
      // Check if the string looks like JSON (starts with '{' or '[' and ends with '}' or ']').
      if (
        (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))
      ) {
        // Try parsing it to confirm if it's valid JSON.
        try {
          JSON.parse(data)
          // If parsing is successful, assume it's already a valid JSON string and store it as is.
          value = data
        } catch (e) {
          // If parsing fails, it's a plain string; store it directly.
          value = data
        }
      } else {
        // Plain string, store it directly.
        value = data
      }
    } else {
      // For numbers, booleans, etc., store them directly.
      value = data
    }
    localStorage.setItem(key, value)
  }

  // Loads data from localStorage.
  static load(key, defaultValue) {
    // Retrieve the item from localStorage. This returns a string or null.
    const stored = localStorage.getItem(key)

    // If a value is found...
    if (stored !== null) {
      try {
        // Try to parse the stored JSON string.
        // If stored is valid JSON, JSON.parse will convert it to the correct type.
        return JSON.parse(stored)
      } catch (error) {
        // If parsing fails, return the raw string.
        return stored
      }
    }

    // If nothing is found, save it to local storage and return the default value.
    LocalStorageManager.save(key, defaultValue)
    return defaultValue
  }

  // Removes data from localStorage
  static remove(key) {
    localStorage.removeItem(key)
  }
}
