import './style.css'
import createBlagueBot from "./bots/BlagueBot.js";
import createMeteoBot from "./bots/MeteoBot.js";
import {loadMessageHistory, saveMessageToLocalStorage} from "./localStorageUtils.js";

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
    element.innerHTML = text;

    attributes.forEach(attr => {
        element.setAttribute(attr.name, attr.value);
    });

    parent.appendChild(element);
    return element;
}

const renderMessage = (message) => {
    const chatMessages = document.querySelector('.chat-messages');
    const messageContainer = createElement(chatMessages, 'div', `chat-message ${message.sender === 'me' ? 'right' : 'left'}`);

    if (message.sender !== 'me') {
        createElement(messageContainer, 'img', 'chatbot-icon', 'chatbot-icon', [
            {name: 'alt', value: 'chatbot-icon'},
            {name: 'src', value: `https://robohash.org/${message.sender}.png`}
        ]);
    }

    const textContainer = createElement(messageContainer, 'div', 'chat-text-container');
    createElement(textContainer, 'div', 'chat-text', message.text);
    createElement(textContainer, 'div', 'chat-date', message.datetime.toLocaleString());

    scrollToBottom();
};

function registerBot(bot) {
    BOTS = [...BOTS, bot];

    const chatSidebar = document.querySelector('.chat-sidebar');
    const botContainer = createElement(chatSidebar, 'div', 'chatbot');
    createElement(botContainer, 'img', 'chatbot-icon', bot.icon, [
        {name: 'alt', value: bot.name},
        {name: 'src', value: `https://robohash.org/${bot.name}.png`}
    ]);
    createElement(botContainer, 'span', 'chatbot-name', bot.name);
}

registerBot(createBlagueBot())
registerBot(createMeteoBot())

const handleUserMessage = () => {
    const input = document.querySelector('.chat-input input')

    if(input.value === 'help') {
        BOTS.forEach(bot => {
            renderMessage(createMessage(bot.help(), new Date(), bot.name))
        })
        return
    }

    const command = input.value.trim()
    if (command) {
        const userMessage = createMessage(command)
        renderMessage(userMessage)
        BOTS.forEach(bot => {
            executeCommand(bot, command)
        })
        input.value = ''
    }
}

const executeCommand = async (bot, command) => {
    const response = await bot.executeCommand(command)
    if (response) {
        renderMessage(createMessage(response, new Date(), bot.name))
    }
}

export const createMessage = (text, datetime = new Date(), sender = 'me') => {
    const message = {
        text,
        datetime,
        sender,
    };

    saveMessageToLocalStorage(message); // Save the message to local storage when it's created
    return message;
};


const loadMessagesFromLocalStorage = () => {
    const history = loadMessageHistory();
    history.forEach((message) => {
        renderMessage(message);
    });
};

document.addEventListener('DOMContentLoaded', loadMessagesFromLocalStorage)
document.querySelector('.chat-input button').addEventListener('click', handleUserMessage)
document.querySelector('.chat-input input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleUserMessage()
    }
})

document.querySelectorAll('.chatbot').forEach((botElement) => {
    botElement.addEventListener('click', () => {
        const botName = botElement.querySelector('.chatbot-name').textContent;
        const bot = BOTS.find(bot => bot.name === botName);
        renderMessage(createMessage(bot.help(), new Date(), bot.name));
    })
})