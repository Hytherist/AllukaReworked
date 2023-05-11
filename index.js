const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js')
require('dotenv/config')

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
            const name = interaction.options.get('create-event').value;
            const startTime = interaction.options.get('start-time').value;

            const embed = new EmbedBuilder()
                .setColor('#CC8899')
                .setTitle(name)
                .setDescription(`Event starting at ${startTime}`)
                .setThumbnail('./images/server.webp')
                .setTimestamp()
                .setFooter({ text: 'Dogbless', iconURL: './images/server.webp' });
            interaction.reply({ embeds: [embed]});
        }
})

client.on('messageCreate', message => {
    if (message.content === 'ping') {
        message.reply('pong')
    }
})

client.login(process.env.TOKEN)