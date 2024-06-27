import './style.css'
import createJokeBot from "./bots/JokeBot.js"
import createWeatherBot from "./bots/WeatherBot.js"
import createCryptoBot from "./bots/CryptoBot.js"
import {loadMessageHistory, saveMessageToLocalStorage} from "./localStorageUtils.js"

let BOTS = []

const initApp = () => {
    configureUI()
    registerBots()
    addEventListeners()
    loadMessageHistory().forEach(message => renderMessage(message))
}

const configureUI = () => {
    document.querySelector('#app').innerHTML = `
        <div class="chat-container">
            <div class="chat-sidebar">
                <div class="chat-header">
                    <h1>Chatbot</h1>
                    <button class="toggle-sidebar">☰</button>
                </div>
                <div class="chatbot-list"></div>
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
}

const registerBots = () => {
    registerBot(createJokeBot())
    registerBot(createWeatherBot())
    registerBot(createCryptoBot())
}

const addEventListeners = () => {
    document.querySelector('.chat-input button').addEventListener('click', handleUserMessage)
    document.querySelector('.chat-input input').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') handleUserMessage()
    })

    document.querySelector('.toggle-sidebar').addEventListener('click', () => {
        document.querySelector('.chatbot-list').classList.toggle('d-none');
    })

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            document.querySelector('.chatbot-list').classList.remove('d-none');
        }
    })
}

const registerBot = (bot) => {
    BOTS = [...BOTS, bot]
    const chatSidebar = document.querySelector('.chatbot-list')
    const botContainer = createElement(chatSidebar, 'div', 'chatbot')
    createElement(botContainer, 'img', 'chatbot-icon', '', [{name: 'alt', value: bot.name}, {
        name: 'src',
        value: `https://robohash.org/${bot.name}.png`
    }])
    createElement(botContainer, 'span', 'chatbot-name', bot.name)
    botContainer.addEventListener('click', () => renderMessage(createMessage(bot.help(), new Date(), bot.name)))
}

const createElement = (parent, tag, className, text = '', attributes = []) => {
    const element = document.createElement(tag)
    element.className = className
    element.innerHTML = text
    attributes.forEach(attr => element.setAttribute(attr.name, attr.value))
    parent.appendChild(element)
    return element
}

const renderMessage = (message) => {
    const chatMessages = document.querySelector('.chat-messages')
    const messageContainer = createElement(chatMessages, 'div', `chat-message ${message.sender === 'me' ? 'right' : 'left'}`)

    if (message.sender !== 'me') {
        createElement(messageContainer, 'img', 'chatbot-icon', '', [{name: 'alt', value: 'chatbot-icon'}, {
            name: 'src',
            value: `https://robohash.org/${message.sender}.png`
        }])
    }

    const textContainer = createElement(messageContainer, 'div', 'chat-text-container')
    createElement(textContainer, 'div', 'chat-text', message.text)
    createElement(textContainer, 'div', 'chat-date', message.datetime.toLocaleString())

    textContainer.querySelectorAll('.command-container').forEach(commandContainer => {
        commandContainer.addEventListener('click', event => {
            executeCommand(BOTS.find(bot => bot.name === message.sender), event.target.innerText);
        });
    });


    scrollToBottom()
}

const scrollToBottom = () => {
    const chatMessages = document.querySelector('.chat-messages')
    chatMessages.scrollTop = chatMessages.scrollHeight
}

const createMessage = (text, datetime = new Date(), sender = 'me') => {
    const message = {text, datetime, sender}
    saveMessageToLocalStorage(message)
    return message
}

const handleUserMessage = () => {
    const input = document.querySelector('.chat-input input')
    const message = input.value.trim()

    if (!message) return

    const command = message.split(' ')[0].toLowerCase()
    const args = message.split(' ').slice(1)

    renderMessage(createMessage(message))

    if (command === 'help') {
        BOTS.forEach(bot => renderMessage(createMessage(bot.help(), new Date(), bot.name)))
    } else {
        let commandExecuted = false
        BOTS.forEach(bot => {
            const hasCommand = bot.getCommands().some(cmd => cmd.command === command)
            if (hasCommand) {
                executeCommand(bot, command, args)
                commandExecuted = true
            }
        })

        if (!commandExecuted) {
            renderMessage(createMessage('Commande inconnue. Tapez help pour obtenir de l\'aide.', new Date(), 'Chatbot'))
        }
    }
    input.value = ''
}

const executeCommand = async (bot, command, args = []) => {
    const response = await bot.executeCommand(command, args)
    if (response) {
        renderMessage(createMessage(response, new Date(), bot.name))
    }
}

document.addEventListener('DOMContentLoaded', initApp)
