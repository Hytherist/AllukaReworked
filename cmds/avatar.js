module.exports = client => {

    const { EmbedBuilder } = require('discord.js');

    client.on('interactionCreate', async (interaction) => {
        if (interaction.commandName === 'avatar') {
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

        }
    })
}