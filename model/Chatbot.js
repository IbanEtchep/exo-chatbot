class Chatbot {
    constructor(name, icon) {
        this.name = name
        this.icon = icon
        this.commands = {}
    }

    addCommand(command, callback) {
        this.commands[command] = callback
    }

    executeCommand(command) {
        if (this.commands[command]) {
            this.commands[command]()
        } else {
            console.log('Command not found')
        }
    }
}