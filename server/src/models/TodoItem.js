const uuid = require("uuid").v4;

class TodoItem {
  constructor ({id, title, done} = {}) {
    this.id = id || uuid();
    this.title = title
    this.done = done
  }

  setTitle (str) {
    this.title = str
    return this
  }

  setDone (bool) {
    this.done = bool
    return this
  }
}

module.exports = TodoItem;
