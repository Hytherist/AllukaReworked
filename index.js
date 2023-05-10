const Discord = require('discord.js')
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
require('dotenv/config')

// const remind = require('./functionalities/reminder');

client.login(process.env.TOKEN)

client.on('ready', () => {
    console.log('bot is ready')
    // remind(client);
})

client.on('messageCreate', message => {
    if (message.content === 'ping') {
        message.reply('pong')
    } 
})
