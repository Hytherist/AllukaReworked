require('dotenv/config');
const { REST, Routes } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const commands = [
    {
        name: 'ping',
        description: 'reply pong',
    },

    {
        name: 'Create event',
        description: 'Creates an event',
        options: [
            new SlashCommandBuilder()
                .setName('Name of event')
                .setDescription('Enter the name of the event')
                .setRequired(true),
            new SlashCommandBuilder()
                .setName('start-time')
                .setDescription('Enter the start time of the event')
                .setRequired(true),
        ]
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...')

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.XXGUILDID),
            { body: commands }
        )

        console.log('Slash commands registerd.')

    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();