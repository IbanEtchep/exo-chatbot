import './style.css'
import Message from "./model/Message.js";
import Chatbot from "./model/Chatbot.js";

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

let BOTS = []

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

function scrollToBottom() {
    const chatMessages = document.querySelector('.chat-messages')
    chatMessages.scrollTop = chatMessages.scrollHeight
}

function createElement(parent, tag, className, text = '', attributes = []) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;

    attributes.forEach(attr => {
        element.setAttribute(attr.name, attr.value);
    });

    parent.appendChild(element);
    return element;
}

function addMessage(message, sender = 'me') {
    const chatMessages = document.querySelector('.chat-messages');
    const messageContainer = createElement(chatMessages, 'div', `chat-message ${sender === 'me' ? 'right' : 'left'}`);
    createElement(messageContainer, 'div', 'chat-text', message.getText());
    createElement(messageContainer, 'div', 'chat-date', message.getFormattedDatetime());
    scrollToBottom();
}

function registerBot(chatbot) {
    BOTS = [...BOTS, chatbot];

    const chatSidebar = document.querySelector('.chat-sidebar');
    const botContainer = createElement(chatSidebar, 'div', 'chatbot');
    createElement(botContainer, 'img', 'chatbot-icon', chatbot.icon, [
        {name: 'alt', value: chatbot.name},
        {name: 'src', value: `https://robohash.org/${chatbot.name}.png`}
    ]);
    createElement(botContainer, 'span', 'chatbot-name', chatbot.name);
}

// Création de TestBot
const bot = new Chatbot('TestBot', '🤖')

bot.onResponse((message) => {
    const msg = new Message(message)
    addMessage(msg, 'bot')
})

bot.addCommand('meteo', async () => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    return 'La météo est ensoleillée avec 20°C.'
})

bot.addCommand('heure', async () => {
    const date = new Date()
    return `Il est actuellement ${date.toLocaleTimeString()} le ${date.toLocaleDateString()}.`
})

bot.addCommand('blague', async () => {
    return 'Pourquoi les poissons détestent l’ordinateur ? Parce qu’ils ont peur du net !'
})

registerBot(bot)

document.querySelector('.chat-input button').addEventListener('click', () => {
    const input = document.querySelector('.chat-input input')
    const command = input.value.trim()
    if (command) {
        const userMessage = new Message(command)
        addMessage(userMessage)
        bot.executeCommand(command)
        input.value = ''
    }
})

document.querySelector('.chat-input input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const input = document.querySelector('.chat-input input')
        const command = input.value.trim()
        if (command) {
            const userMessage = new Message(command)
            addMessage(userMessage)
            bot.executeCommand(command)
            input.value = ''
        }
    }
})