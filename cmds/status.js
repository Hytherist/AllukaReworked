module.exports = client => {

    const { ActivityType } = require('discord.js');

    client.on('interactionCreate', async (interaction) => {
        if (interaction.commandName === 'set-status') {

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
        }
    })
}