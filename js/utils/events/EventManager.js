export class EventManager {
  static dispatchEvent(eventName) {
    document.dispatchEvent(new Event(eventName))
  }

  static addEventListener(eventName, callback) {
    document.addEventListener(eventName, callback)
  }
}
