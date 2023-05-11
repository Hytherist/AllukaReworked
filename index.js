const { Client, GatewayIntentBits } = require('discord.js')
require('dotenv/config')

const { EmbedBuilder } = require('discord.js');

// const remind = require('./functionalities/reminder');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

client.on('ready', () => {
    console.log('bot is ready')
    // remind(client);
})

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        interaction.reply('pong')
    } else

    if (interaction.commandName === 'event') {
        const name = interaction.options.getString('create-event');
        const startTime = interaction.options.getNumber('start-time');

        const exampleEmbed = new EmbedBuilder()
            .setColor('#CC8899')
            .setTitle(name)
            .setDescription(`Event starting at ${startTime}`)
            .setThumbnail('./images/server.webp')
            .setTimestamp()
            .setFooter({ text: 'Dogbless', iconURL: './images/server.webp' });
        interaction.reply({ embeds: [exampleEmbed] })
    }
})

client.on('messageCreate', message => {
    if (message.content === 'ping') {
        message.reply('pong')
    }
})

client.login(process.env.TOKEN)