import createBot from './createBot';

const createBlagueBot = () => {
    const bot = createBot('BlagueBot');
    bot.addCommand('blague', 'Raconte une blague pour égayer votre journée', async () => {
        // TODO
        return 'Pourquoi les poissons détestent l’ordinateur ? Parce qu’ils ont peur du net !';
    });
    return bot;
}

export default createBlagueBot;