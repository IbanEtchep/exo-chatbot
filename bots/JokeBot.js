import createBot from './createBot'

const createBlagueBot = () => {
    const bot = createBot('BlagueBot')
    bot.addCommand('blague', 'Raconte une blague pour égayer votre journée', async () => {
        try {
            const response = await fetch('https://v2.jokeapi.dev/joke/Any?lang=fr&blacklistFlags=nsfw,religious,political,racist,sexist,explicit')
            const data = await response.json()

            if (data.error) {
                return 'Désolé, je n\'ai pas pu trouver de blague pour le moment.'
            }

            if (data.type === 'single') {
                return data.joke
            } else if (data.type === 'twopart') {
                return `${data.setup} ${data.delivery}`
            }
        } catch (error) {
            return 'Une erreur est survenue en tentant de récupérer une blague.'
        }
    })
    return bot
}

export default createBlagueBot