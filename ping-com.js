require('dotenv/config');
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'ping',
        description: 'reply pong',
    },

    {
        name: 'event',
        description: 'Creates an event',
        options: [
            {
                name: 'create-event',
                description: 'Enter the name of the event',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'start-time',
                description: 'Enter the start time of the event',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'where',
                description: 'Enter the location',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ]
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...')

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.XXGUILDID),
            { body: commands }
        )

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.DBGUILDID),
            { body: commands }
        );

        console.log('Slash commands registerd.')

    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();