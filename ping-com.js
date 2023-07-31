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
                name: 'name',
                description: 'Enter the name of the event',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'hour',
                description: 'Enter the start time of the event',
                type: ApplicationCommandOptionType.Integer,
                required: true,
                choices: Array.from({ length: 12 }, (_, i) => ({
                    name: (i + 1).toString(), 
                    value: i + 1,
                })),
            },
            {
                name: 'minute',
                description: 'Enter the minute',
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    { name: '00', value: '00' },
                    { name: '30', value: '30' },
                ],
            },
            {
                name: 'time-of-day',
                description: 'AM or PM',
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    { name: 'AM', value: 'AM' },
                    { name: 'PM', value: 'PM' },
                ],
            },
            {
                name: 'location',
                description: 'Enter the location',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ]
    },

    {
        name: 'set-status',
        description: 'Set the status of Kavix',
        options: [
            {
                name: 'status',
                description: 'Choose the type of status Kavix should have',
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    { name: 'online', value: 'online' },
                    { name: 'idle', value: 'idle' },
                    { name: 'do not disturb', value: 'dnd' },
                    { name: 'invisible', value: 'invisible' },
                ],
            },

            {
                name: 'type-of-activity',
                description: 'Choose the type of activity Kavix should have',
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    { name: 'playing', value: '0' },
                    { name: 'listening', value: '2' },
                    { name: 'watching', value: '3' },
                    { name: 'competing', value: '5' },
                ],
            },

            {
                name: 'activity',
                description: 'Write the activity Kavix should have',
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