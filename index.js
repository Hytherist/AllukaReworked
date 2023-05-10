const { Client, GatewayIntentBits } = require('discord.js')
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

client.on('messageCreate', message => {
    if (message.content === 'ping') {
        message.reply('pong')
    } 
})

client.login(process.env.TOKEN)