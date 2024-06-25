const MESSAGE_HISTORY_KEY = 'chat_message_history'

export const saveMessageToLocalStorage = (message) => {
    let history = JSON.parse(localStorage.getItem(MESSAGE_HISTORY_KEY)) || []
    history.push(message)
    localStorage.setItem(MESSAGE_HISTORY_KEY, JSON.stringify(history))
}

export const loadMessageHistory = () => {
    return JSON.parse(localStorage.getItem(MESSAGE_HISTORY_KEY)) || []
}