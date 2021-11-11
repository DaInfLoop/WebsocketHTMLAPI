class WebsocketHTMLAPI {
  constructor() {
    this.sockets = {};
  }
  add(element) {
    if (!element) throw new Error("No element was passed in.")
    if (element.tagName != "WEBSOCKET") throw new Error("The element passed in must be a <websocket> element.")
    if (!element.id) throw new Error("This element does not have an ID to use for identification.")
    if (!Object.keys(this.sockets).every(val => val == element.id)) throw new Error("This element has an ID of which another element has.")
    this.sockets[element.id] = [new WebSocket(element.getAttribute('src')), element]

    Array.from(websocket.sockets[element.id][1].children).forEach(child => {
      child.style.setProperty('display', 'none')
      if (child.tagName == "EVENT") {
        if (child.className == "opened") {
          this.sockets[element.id][0].onopen = function () {
            child.style.setProperty('display', 'block')
          }
        }
        if (child.className == "message") {
          this.sockets[element.id][0].onmessage = function (msg) {
            var clone = child.cloneNode(true)
            clone.innerHTML = clone.innerHTML.replaceAll('{latestMessage}', `${msg.data}`)
            clone.style.setProperty('display', 'block')
            document.querySelector(child.getAttribute('cloneparent') || `#${element.id}`).appendChild(clone)
          }
        }      }
    })
  }
  send(id, message) {
    websocket.sockets[id][0].send(message || 'foo bar')
  }
};

const websocket = new WebsocketHTMLAPI();

Object.values(document.all).forEach(element => {
  if (element.tagName == "WEBSOCKET") {
    websocket.add(element)
  }
})