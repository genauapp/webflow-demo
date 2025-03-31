class ListNavigator {
  list = []
  index = 0

  constructor(list, startIndex = 0) {
    if (!Array.isArray(list) || list.length === 0) {
      throw new Error('A non-empty array is required.')
    }
    this.list = list
    this.index = startIndex >= 0 && startIndex < list.length ? startIndex : 0
  }

  first() {
    this.index = 0
    return this.current()
  }

  last() {
    this.index = this.list.length - 1
    return this.current()
  }

  next() {
    if (this.index < this.list.length - 1) {
      this.index++
    }
    return this.current()
  }

  prev() {
    if (this.index > 0) {
      this.index--
    }
    return this.current()
  }

  current() {
    return this.list[this.index]
  }
}
