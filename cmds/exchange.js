module.exports = (client) => {
    const apiUrl = 'https://api.frankfurter.app';

    function getLatestRates(interaction) {
        fetch(`${apiUrl}/latest`)
            .then((response) => response.json())
            .then((data) => {
                const responseMessage = 'Latest Exchange Rates:\n' + JSON.stringify(data, null, 2);
                interaction.reply(responseMessage);
            })
            .catch((error) => {
                console.error('Error fetching latest rates:', error);
            });
    }

    function convertCurrency(interaction, amount, fromCurrency, toCurrency) {
        fetch(`${apiUrl}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)
            .then((response) => response.json())
            .then((data) => {
                const result = `${amount} ${fromCurrency} = ${data.rates[toCurrency]} ${toCurrency}`;
                interaction.reply(result);
            })
            .catch((error) => {
                console.error('Error converting currency:', error);
            });
    }

    function getCurrencySymbols(interaction) {
        fetch(`${apiUrl}/currencies`)
            .then((response) => response.json())
            .then((data) => {
                const responseMessage = 'Available Currency Symbols:\n' + JSON.stringify(data, null, 2);
                interaction.reply(responseMessage);
            })
            .catch((error) => {
                console.error('Error fetching currency symbols:', error);
            });
    }

    client.on('interactionCreate', async (interaction) => {
        if (interaction.commandName === 'exchange') {
            const amount = interaction.options.getString('amount');
            const from = interaction.options.getString('from');
            const to = interaction.options.getString('to');
            convertCurrency(interaction, amount, from, to);
        } else if (interaction.commandName === 'latest') {
            getLatestRates(interaction);
        } else if (interaction.commandName === 'symbols') {
            getCurrencySymbols(interaction);
        }
    });
};
