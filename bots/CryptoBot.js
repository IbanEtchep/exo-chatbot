import createBot from './createBot'

const createCryptoBot = () => {
    const bot = createBot('CryptoBot')

    const getCryptoPrice = async (cryptoId) => {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd`)
            const data = await response.json()
            if (data[cryptoId] && data[cryptoId].usd !== undefined) {
                return data[cryptoId].usd
            } else {
                throw new Error('Prix non disponible')
            }
        } catch (error) {
            return null
        }
    }

    bot.addCommand('bitcoin', 'Donne le cours actuel du Bitcoin', async () => {
        const price = await getCryptoPrice('bitcoin')
        if (price !== null) {
            return `Le cours actuel du Bitcoin est de : $${price}`
        } else {
            return 'Une erreur est survenue en tentant de récupérer le cours du Bitcoin.'
        }
    })

    bot.addCommand('eth', 'Donne le cours actuel de l\'Ethereum', async () => {
        const price = await getCryptoPrice('ethereum')
        if (price !== null) {
            return `Le cours actuel de l'Ethereum est de : $${price}`
        } else {
            return 'Une erreur est survenue en tentant de récupérer le cours de l\'Ethereum.'
        }
    })

    bot.addCommand('sol', 'Donne le cours actuel du Solana', async () => {
        const price = await getCryptoPrice('solana')
        if (price !== null) {
            return `Le cours actuel du Solana est de : $${price}`
        } else {
            return 'Une erreur est survenue en tentant de récupérer le cours du Solana.'
        }
    })

    return bot
}

export default createCryptoBot