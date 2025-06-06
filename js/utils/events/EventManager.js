class EventManager {
  static publish(eventName) {
    document.dispatchEvent(new CustomEvent(eventName))
  }

  static subscribe(eventName, callback) {
    document.addEventListener(eventName, callback)
  }
}

export default EventManager
