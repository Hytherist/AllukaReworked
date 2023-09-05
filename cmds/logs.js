module.exports = client => {

    const fs = require('fs');

    const deletedMessagesByGuild = {};
    const maxDeletedMessages = 10;

    client.on('interactionCreate', async (interaction) => {
        if (interaction.commandName === 'logs') {

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
    })

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
}