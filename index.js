const { Client, GatewayIntentBits, EmbedBuilder, Embed } = require('discord.js')
require('dotenv/config')

// const remind = require('./functionalities/reminder');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
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
        const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

        // const button = new ActionRowBuilder()
        //     .addComponents(
        //         new ButtonBuilder()
        //             .setCustomId('button')
        //             .setLabel('Down')
        //             .setStyle(ButtonStyle.Primary),

        //         new ButtonBuilder()
        //             .setCustomId('button2')
        //             .setLabel('Remove')
        //             .setStyle(ButtonStyle.Primary),
        //     )

        const name = interaction.options.get('create-event').value;
        console.log('name:', name);
        const startTime = interaction.options.get('start-time').value;
        console.log('startTime:', startTime);
        const place = interaction.options.get('where').value;
        console.log('location:', place);

        const embed = new EmbedBuilder()
            .setColor('#CC8899')
            .setTitle(name)
            .setDescription('**Time: **' + startTime + `\n**Location: **` + place )
            // .addFields(
            //     { name: 'Going: ', value: '' },
            // )
            .setThumbnail(interaction.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({ text: 'Created by: ' + interaction.user.tag });

        interaction.reply({ embeds: [embed] })

        // const collector = interaction.channel.createMessageCollector();

        // collector.on('collect', async i => {

        //     if (i.customId === 'button') {
        //         const existingEmbed = i.message.embeds[0];

        //         const fields = existingEmbed.fields;

        //         const fieldToUpdate = fields.find(field => field.name === 'Going: ');
        //         fieldToUpdate.value = existingEmbed.fields.value + interaction.user.tag;


        //         const updatedEmbed = new EmbedBuilder(existingEmbed).spliceFields(0, existingEmbed.fields.length, ...fields);
        //         await i.update({ embeds: [updatedEmbed], components: [button] })
        //     }

        // })
    }
})

client.on('messageCreate', message => {
    if (message.content === 'ping') {
        message.reply('pong')
    }
})

client.login(process.env.TOKEN)