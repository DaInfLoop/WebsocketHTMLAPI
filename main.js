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
      if (child.tagName == "EVENT") {
        child.style.setProperty('display', 'none')
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
            // Overwrite the style
            if (child.getAttribute('overwrite_style')) {
              child.getAttribute('overwrite_style').split(';').forEach(style => {
                let x = style.split(':')
                clone.style.setProperty(x[0], x[1])
              })
            }
            // Continue!
            clone.className = ""
            clone.outerHTML = clone.outerHTML.replace("<event", `<${child.getAttribute('clone_elementname')}` || "<event")
            clone.outerHTML = clone.outerHTML.replace("</event", `</${child.getAttribute('clone_elementname')}` || "</event")
            document.querySelector(child.getAttribute('clone_parent') || `#${element.id}`).appendChild(clone)
          }
        }
      }
    })
  }
  send(id, message) {
    websocket.sockets[id][0].send(message || 'foo bar')
  }
};

const websocket = new WebsocketHTMLAPI();

Array.from(document.querySelectorAll('websocket')).forEach(element => {
  if (element.tagName == "WEBSOCKET") {
    websocket.add(element)
  }
})
