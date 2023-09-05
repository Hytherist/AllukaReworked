const { GatewayIntentBits, Client } = require('discord.js');
require('dotenv/config');

const pingCMD = require('./cmds/ping.js');
const eventCMD = require('./cmds/event.js');
const logsCMD = require('./cmds/logs.js');
const statusCMD = require('./cmds/status.js');
const avatarCMD = require('./cmds/avatar.js');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

client.on('debug', console.log);

client.on('ready', () => {
    client.user.setPresence({
        activities: [{ name: "Bot is online",}],
        botStatus: 'idle',
    });

    pingCMD(client);
    eventCMD(client);
    logsCMD(client);
    statusCMD(client);
    avatarCMD(client);

    console.log('bot is ready');
});

client.login(process.env.token);
