module.exports = client => {

    const { ComponentType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

    client.on('interactionCreate', async (interaction) => {
        if (interaction.commandName === 'event') {

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
        }
    })

}