class Chatbot {
    constructor(name, icon) {
        this.name = name
        this.icon = icon
        this.commands = {}
        this.responseCallback = () => {}
    }

    addCommand(command, callback) {
        this.commands[command] = callback
    }

    async executeCommand(command) {
        if (this.commands[command]) {
            try {
                const result = await this.commands[command]()
                this.responseCallback(result)
            } catch (error) {
                this.responseCallback(`Une erreur est survenue: ${error.message}`)
            }
        } else {
            this.responseCallback("Je ne comprends pas votre demande.")
        }
    }

    onResponse(fn) {
        this.responseCallback = fn
    }
}

export default Chatbot