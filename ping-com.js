require('dotenv/config');
const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'ping',
        description: 'reply pong',
    },
];

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...')

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID,process.env.XXGUILDID),
            { body: commands }
        )

        console.log('Slash commands registerd.')

    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();