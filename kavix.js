const { ComponentType, GatewayIntentBits, EmbedBuilder, Client, ActivityType  } = require('discord.js');
require('dotenv/config');

const fs = require('fs');

const deletedMessagesByGuild = {};
const maxDeletedMessages = 10;


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
                       
                        i.reply({ content: `You are already on the attendees list.`, ephemeral: true });
                        return;
                    }
                   
                    attendees.push(i.user.tag);

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
                    
                    const index = attendees.indexOf(i.user.tag);
                    if (index === -1) {

                        i.reply({ content: `You are not on the attendees list.`, ephemeral: true });
                        return;
                    }

                    attendees.splice(index, 1);

                    const attendanceText = attendees.length > 0 ? attendees.join('\n') : 'No one is attending yet';

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
                activities: [{ name: botActivity, type: ActivityType.Listening }],
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

    } else if (interaction.commandName === 'avatar') {
        const user = interaction.options.getUser('user'); 
      
        if (!user) {
          await interaction.reply('Please specify a user.');
          return;
        }
      
        const avatar = new EmbedBuilder()
          .setTitle(`${user.tag}`)
          .setImage(`${user.displayAvatarURL({ dynamic: true, size: 256 })}`)
          .setColor('Blue'); 
      
        await interaction.reply({ embeds: [avatar] });

    } else if (interaction.commandName === 'logs') {
       
        const guildID = interaction.guild.id;
    
        const txtFile = `${guildID}.txt`;
    
        fs.readFile(txtFile, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading ${txtFile}:`, err);
                interaction.reply('An error occurred while reading the deleted messages.');
                return;
            }
    
            interaction.reply(`Here are the last 10 deleted messages:\n\`\`\`${data}\`\`\``);
        });
    }
});

function saveDeletedMessages(guildID) {
   
    const deletedMessages = deletedMessagesByGuild[guildID] || [];
    
    const messagesString = deletedMessages.join('\n\n');

    const txtFile = `${guildID}.txt`;
    fs.writeFileSync(txtFile, messagesString);

    deletedMessagesByGuild[guildID] = deletedMessages;
}

client.on('messageDelete', (message) => {
   
    const guildID = message.guild.id;

    const deletedMessages = deletedMessagesByGuild[guildID] || [];

    const formattedMessage = `${message.author.tag} (${new Date().toLocaleString()}): ${message.content}`;
    deletedMessages.push(formattedMessage);

    if (deletedMessages.length > maxDeletedMessages) {
        deletedMessages.shift(); 
    }

    saveDeletedMessages(guildID);
});

client.login(process.env.token);
