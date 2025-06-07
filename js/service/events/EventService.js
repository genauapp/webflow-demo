class EventService {
  constructor(eventTarget = document) {
    this.eventTarget = eventTarget;
  }

  publish(eventName, detail) {
    this.eventTarget.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  subscribe(eventName, callback) {
    this.eventTarget.addEventListener(eventName, callback);
    return () => this.unsubscribe(eventName, callback); // Return unsubscribe function
  }

  unsubscribe(eventName, callback) {
    this.eventTarget.removeEventListener(eventName, callback);
  }
}

// Singleton instance (default export)
const eventService = new EventService();
export default eventService;