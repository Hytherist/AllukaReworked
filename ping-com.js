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

    {
        name: 'avatar',
        description: 'Display user avatar',
        options: [
            {
                name: 'user',
                description: 'The user (mention) to display the avatar of.',
                type: ApplicationCommandOptionType.User,
                required: true,
            },
        ],

    },

    {
        name: 'logs',
        description: 'Fetch the last 10 deleted messages',
        choices: [
            { name: 'true', value: '1' },
            { name: 'false', value: '0' },
        ],
        required: true,

    },

    {
        name: 'exchange',
        description: 'Retrieve the exchange rate between two',
        options: [
            {
                name: 'amount',
                description: 'Enter amount',
                type: ApplicationCommandOptionType.String,
                required: true,
            },

            {
                name: 'from',
                description: 'Select currency #1',
                type: ApplicationCommandOptionType.String,
                required: true,

            },

            {
                name: 'to',
                description: 'Select currency #2',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ],
        required: true,

    },

    {
        name: 'latest',
        description: 'Get the latest conversions',
        required: true,
    },

    {
        name: 'symbols',
        description: 'Get all symbols',
        required: true,
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...')

        await rest.put( // Test
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.XXGUILDID),
            { body: commands }
        )

        await rest.put( // Dogbless
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.DBGUILDID),
            { body: commands }
        );

        await rest.put( // Where we goin
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.WWGGUILDID),
            { body: commands }
        );

        await rest.put( // Hytherist
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.HGUILDID),
            { body: commands }
        );

        console.log('Slash commands registerd.')

    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();