const createBot = (name) => {
    return {
        name,
        commands: {},
        addCommand(command, description, callback) {
            this.commands[command] = { description, callback }
        },
        async executeCommand(command, args = []) {
            if (this.commands[command]) {
                return await this.commands[command].callback(args)
            }
            return null
        },
        getCommands() {
            return Object.keys(this.commands).map(key => ({
                command: key,
                description: this.commands[key].description
            }))
        },
        help() {
            const commandsList = this.getCommands().map(cmd => `<div><span class="command-container">${cmd.command}</span>: ${cmd.description}</div>`).join('')
            return `Voici la liste des commandes disponibles:<br>${commandsList}`
        },
    }
}

export default createBot
