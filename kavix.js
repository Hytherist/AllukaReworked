const { ComponentType, GatewayIntentBits, EmbedBuilder, Client, ActivityType  } = require('discord.js');
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
    client.user.setPresence({
        activities: [{ name: "Bot is online",}],
        botStatus: 'idle',
    });
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
                    .setLabel('Not Interested')
                    .setStyle(ButtonStyle.Primary),

                // new ButtonBuilder()
                //     .setCustomId('button3')
                //     .setLabel('Delete')
                //     .setStyle(ButtonStyle.Danger),
            );

        const confirmation = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('Confirm')
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger),

            );

        const nameofevent = interaction.options.get('name').value;
        console.log('name:', nameofevent);
        const hour = interaction.options.get('hour').value;
        console.log('Hour:', hour);
        const minute = interaction.options.get('minute').value;
        console.log('Hour:', minute);
        const timeofday = interaction.options.get('time-of-day').value;
        console.log('location:', timeofday);
        const location = interaction.options.get('location').value;
        console.log('location:', location);

        const attendees = [interaction.user.tag];

        const embed = new EmbedBuilder()
            .setColor('#CC8899')
            .setTitle(nameofevent)
            .setDescription('**Time: **' + hour + ":" + minute + " " + timeofday + `\n**Location: **` + location)
            .addFields({ name: 'Going: ', value: attendees.join('\n') })
            .setThumbnail(interaction.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({ text: 'Created by: ' + interaction.user.tag });

        try {
            const initialResponse = await interaction.reply('Creating Event...');

            const clonedChannel = await interaction.channel.clone();
            const originalPosition = interaction.channel.position;
            await clonedChannel.setPosition(originalPosition);
            await clonedChannel.setName(nameofevent + " at " + location);

            let message = await clonedChannel.send({ embeds: [embed], components: [button] });

            let collector = message.createMessageComponentCollector({
                componentType: ComponentType.Button,
            });

            await initialResponse.edit(`Event Created in <#${clonedChannel.id}>`);

            collector.on('collect', async i => {
                if (i.customId === 'button') {
                    console.log("Down");

                    const index = attendees.indexOf(i.user.tag);
                    if (index !== -1) {
                        // If the user is not in the attendees list, send a message and return early
                        i.reply({ content: `You are already on the attendees list.`, ephemeral: true });
                        return;
                    }
                    // Add the user's tag to the list of attendees
                    attendees.push(i.user.tag);

                    // Create a new embed with the updated attendees list
                    const newEmbed = new EmbedBuilder()
                        .setColor('#CC8899')
                        .setTitle(nameofevent)
                        .setDescription('**Time: **' + hour + ":" + minute + " " + timeofday + `\n**Location: **` + location)
                        .addFields({ name: 'Going: ', value: attendees.join('\n') })
                        .setThumbnail(interaction.user.displayAvatarURL())
                        .setTimestamp()
                        .setFooter({ text: 'Created by: ' + interaction.user.tag });

                    message.edit({ embeds: [newEmbed] });

                    i.reply({ content: `You have added yourself to the attendees list.`, ephemeral: true });
                } else if (i.customId === 'button2') {

                    console.log("Not Interested");
                    // Handle button click event for 'Remove' button
                    const index = attendees.indexOf(i.user.tag);
                    if (index === -1) {
                        // If the user is not in the attendees list, send a message and return early
                        i.reply({ content: `You are not on the attendees list.`, ephemeral: true });
                        return;
                    }

                    attendees.splice(index, 1); // Remove the user from the attendees list

                    const attendanceText = attendees.length > 0 ? attendees.join('\n') : 'No one is attending yet';

                    // Create a new embed with the updated attendees list
                    const newEmbed = new EmbedBuilder()
                        .setColor('#CC8899')
                        .setTitle(nameofevent)
                        .setDescription('**Time: **' + hour + ":" + minute + " " + timeofday + `\n**Location: **` + location)
                        .addFields({ name: 'Going: ', value: attendanceText })
                        .setThumbnail(interaction.user.displayAvatarURL())
                        .setTimestamp()
                        .setFooter({ text: 'Created by: ' + interaction.user.tag });

                    message.edit({ embeds: [newEmbed] });

                    i.reply({ content: `You have removed yourself from the attendees list.`, ephemeral: true });
                }

                // } else {

                //     console.log("Delete");

                //     message = await i.reply({ content: `Would you like to delete this event?`, components: [confirmation], ephemeral: true });

                //     console.log("Here");

                //     collector = i.message.createMessageComponentCollector({
                //         filter: j => j.user.id === i.user.id, // Only listen to the user's response
                //         time: 15000, // Time in milliseconds to wait for the user's response (15 seconds in this case)
                //         max: 1, // Maximum number of interactions to collect (1 in this case)
                //         errors: ['time'], // How to handle timeout errors
                //     });
            
                //     collector.on('collect', j => {
                //         console.log("inside");
                //         if (j.customId === 'confirm') {
                //             console.log("Confirm");
                //             // Perform the deletion process here
                //             const fetchedChannel = i.message.guild.channels.cache.find(r => r.name === nameofevent);
            
                //             if (fetchedChannel) {
                //                 fetchedChannel.delete().then(() => {
                //                     console.log('Event channel deleted.');
                //                 }).catch(error => {
                //                     console.error('Error deleting event channel:', error);
                //                 });
                //             } else {
                //                 console.error('Event channel not found.');
                //             }
                //         } else if (j.customId === 'cancel') {
                //             console.log("Cancel");
                //             // Handle the cancelation here
                //             j.reply({ content: 'Deletion canceled.', ephemeral: true });
                //         }
                //     });
            
                //     collector.on('end', collected => {
                //         console.log(`Collected second: ${collected.size} interactions.`);
                //     });            

                // }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });

        } catch (error) {
            console.error('Error during interaction handling:', error);
        }
    } else if (interaction.commandName === 'set-status') {

        const botStatus = interaction.options.get('status').value;
        console.log('status:', botStatus);
        const botType = interaction.options.get('type-of-activity').value;
        console.log('type:', botType);
        const botActivity = interaction.options.get('activity').value;
        console.log('activity:', botActivity);

        if (botType === '0') {
            client.user.setPresence({
                activities: [{ name: botActivity, type: ActivityType.Playing }],
               status: botStatus,
            });
        } else if (botType === '1') {
            client.user.setPresence({
                activities: [{ name: botActivity, type: ActivityType.Streaming }],
               status: botStatus,
            });
        } else if (botType === '3') {
            client.user.setPresence({
                activities: [{ name: botActivity, type: ActivityType.Watching }],
               status: botStatus,
            });
        } else if (botType === '5') {
            client.user.setPresence({
                activities: [{ name: botActivity, type: ActivityType.Competing }],
               status: botStatus,
            });
        }

        interaction.reply("You have changed <@1105288534228742246> 's status.");
    }
});

client.on('messageCreate', message => {
    if (message.content === 'ping') {
        message.reply('pong');
    }
});

client.login("MTEwNTI4ODUzNDIyODc0MjI0Ng.GbKVIX.wKNMr5brWIWEsu15qpl369oAtDNu7cGD-9kUtA");
