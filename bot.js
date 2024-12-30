const mineflayer = require('mineflayer');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
    try {
        // Get server details from user
        const host = await askQuestion('Enter the server IP: ');
        const portInput = await askQuestion('Enter the server port (default: 25565): ');
        const port = portInput ? parseInt(portInput, 10) : 25565;
        const botCountInput = await askQuestion('Enter the number of bots to join: ');
        const numberOfBots = parseInt(botCountInput, 10);
        const usernamePrefix = await askQuestion('Enter the username prefix (e.g., Bot): ');
        const delayInput = await askQuestion('Enter delay between bot joins in milliseconds (default: 4000): ');
        const delayBetweenBots = delayInput ? parseInt(delayInput, 10) : 4000;

        rl.close();

        // Validate inputs
        if (!host || isNaN(port) || isNaN(numberOfBots) || !usernamePrefix) {
            console.error('Invalid input. Please provide valid server details and bot configurations.');
            process.exit(1);
        }

        console.log(`Starting stress test with ${numberOfBots} bots...`);

        function createBot(username) {
            const bot = mineflayer.createBot({
                host: host,
                port: port,
                username: username,
            });

            bot.on('login', () => {
                console.log(`${username} has joined the server.`);
                // Simulate movement
                setInterval(() => {
                    const x = Math.random() * 10 - 5; // Random movement
                    const z = Math.random() * 10 - 5;
                    bot.entity.position.offset(x, 0, z);
                }, 2000);
            });

            bot.on('end', () => {
                console.log(`${username} has disconnected.`);
            });

            bot.on('error', (err) => {
                console.error(`${username} encountered an error:`, err);
            });
        }

        for (let i = 1; i <= numberOfBots; i++) {
            const username = `${usernamePrefix}${i}`;
            createBot(username);
            await new Promise(resolve => setTimeout(resolve, delayBetweenBots));
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();
