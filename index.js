const { ComponentType, GatewayIntentBits, EmbedBuilder, Client } = require('discord.js');
require('dotenv/config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

// Set the logging level to debug for detailed logging
client.on('debug', console.log);

client.on('ready', () => {
    console.log('bot is ready');
});


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('pong');
    } else if (interaction.commandName === 'event') {
        const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('button')
                    .setLabel('Down')
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId('button2')
                    .setLabel('Remove')
                    .setStyle(ButtonStyle.Primary),
            );

        const nameofevent = interaction.options.get('create-event').value;
        console.log('name:', nameofevent);
        const startTime = interaction.options.get('start-time').value;
        console.log('startTime:', startTime);
        const place = interaction.options.get('where').value;
        console.log('location:', place);

        const attendees = [interaction.user.tag];

        const embed = new EmbedBuilder()
            .setColor('#CC8899')
            .setTitle(nameofevent)
            .setDescription('**Time: **' + startTime + `\n**Location: **` + place)
            .addFields({ name: 'Going: ', value: attendees.join('\n') })
            .setThumbnail(interaction.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({ text: 'Created by: ' + interaction.user.tag });

        try {
            const initialResponse = await interaction.reply('Creating Event...');

            const clonedChannel = await interaction.channel.clone();
            const originalPosition = interaction.channel.position;
            await clonedChannel.setPosition(originalPosition);
            await clonedChannel.setName(nameofevent);

            const message = await clonedChannel.send({ embeds: [embed], components: [button] });

            const collector = message.createMessageComponentCollector({
                componentType: ComponentType.Button,
            });

            await initialResponse.edit(`Event Created in <#${clonedChannel.id}>`);

            collector.on('collect', i => {
                if (i.customId === 'button') {
                    console.log("clicked");

                    // Add the user's tag to the list of attendees
                    attendees.push(i.user.tag);

                    // Create a new embed with the updated attendees list
                    const newEmbed = new EmbedBuilder()
                        .setColor('#CC8899')
                        .setTitle(nameofevent)
                        .setDescription('**Time: **' + startTime + `\n**Location: **` + place)
                        .addFields({ name: 'Going: ', value: attendees.join('\n') })
                        .setThumbnail(interaction.user.displayAvatarURL())
                        .setTimestamp()
                        .setFooter({ text: 'Created by: ' + interaction.user.tag });

                    message.edit({ embeds: [newEmbed] });

                    i.reply({ content: `You have added yourself to the attendees list.`, ephemeral: true });
                } else if (i.customId === 'button2') {
                    // Handle button click event for 'Remove' button
                    const index = attendees.indexOf(i.user.tag);
                    if (index === -1) {
                        // If the user is not in the attendees list, send a message and return early
                        i.reply({ content: `You are not on the attendees list.`, ephemeral: true });
                        return;
                    }

                    attendees.splice(index, 1); // Remove the user from the attendees list

                    // Create a new embed with the updated attendees list
                    const newEmbed = new EmbedBuilder()
                        .setColor('#CC8899')
                        .setTitle(nameofevent)
                        .setDescription('**Time: **' + startTime + `\n**Location: **` + place)
                        .addFields({ name: 'Going: ', value: attendees.join('\n') })
                        .setThumbnail(interaction.user.displayAvatarURL())
                        .setTimestamp()
                        .setFooter({ text: 'Created by: ' + interaction.user.tag });

                    message.edit({ embeds: [newEmbed] });

                    i.reply({ content: `You have removed yourself from the attendees list.`, ephemeral: true });
                }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });

        } catch (error) {
            console.error('Error during interaction handling:', error);
        }
    }
});

client.on('messageCreate', message => {
    if (message.content === 'ping') {
        message.reply('pong');
    }
});

client.login(process.env.TOKEN);
