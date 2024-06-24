import './style.css'
import Message from "./model/Message.js";

/**
 * Utilisation fonction pure, récursive, d'ordre supérieur, map filter reduce
 *
 * TODO:
 *
 * Créer un chatbot:
 * 1 - meteo
 * 2 - heure et date
 * 3 - blague
 *
 * Stocker l'histoire des commandes et réponses dans le local storage
 */

document.querySelector('#app').innerHTML = `
<div class="chat-container">
  <div class="chat-sidebar">
    <div class="chat-header">
    <h1>Chatbot</h1>
  </div>
</div>
  <div class="chat-main">
    <div class="chat-messages"></div>
    <div class="chat-input">
      <input type="text" placeholder="Que voulez-vous faire? (tapez help pour recevoir de l'aide)" />
      <button>Envoyer</button>
    </div>
  </div>
</div>
`

function createElement(tag, className, text = '', attribute = []) {
    const element = document.createElement(tag)
    element.className = className
    element.textContent = text

    for (let i = 0; i < attribute.length; i++) {
        element.setAttribute(attribute[i].name, attribute[i].value)
    }

    return element
}

function addMessage(message, position) {
    const chatMessages = document.querySelector('.chat-messages')
    const messageContainer = createElement('div', `chat-message ${position}`)
    chatMessages.appendChild(messageContainer)
    const textContainer = createElement('div', 'chat-text', message.getText())
    messageContainer.appendChild(textContainer)
    let dateFormatted = message.getDatetime().toLocaleString()
    const dateContainer = createElement('div', 'chat-date', dateFormatted)
    messageContainer.appendChild(dateContainer)
}

addMessage(new Message('Hello'), 'left')
addMessage(new Message('Hi'), 'right')
addMessage(new Message('lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc lacinia'), 'left')
addMessage(new Message('lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc lacinia'), 'right')