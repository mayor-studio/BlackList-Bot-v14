const { Client, GatewayIntentBits, Collection, ActivityType, EmbedBuilder } = require('discord.js');

const fs = require('fs');

const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers
    ]
});

const { token, prefix } = require("./config.js");

console.log(`==============================================`);
console.log(`         MAYOR STUDIO BOT                  `);
console.log(`         Powered by Discord.js            `);
console.log(`==============================================`);
console.log(`  Copyright (c) MAYOR STUDIO - https://discord.gg/mayor`);
console.log(`==============================================`);

client.messageCommand = new Collection();

const messageFiles = fs.readdirSync(path.join(__dirname, 'messageCommand')).filter(file => file.endsWith('.js'));

for (const file of messageFiles) {
    const message = require(`./messageCommand/${file}`);
    client.messageCommand.set(message.name, message);
}

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const messageName = args.shift().toLowerCase();  

    const messagess = client.messageCommand.get(messageName) || client.messageCommand.find(cmd => cmd.alliases && cmd.alliases.includes(messageName));

    if (!messagess) return;

    try {
        messagess.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply('حصل خطا في البوت');
    }
});

client.once("ready", async () => {
    console.log(`==============================================`);
    console.log(`         MAYOR STUDIO BOT IS ONLINE          `);
    console.log(`==============================================`);
    client.user.setActivity("MAYOR STUDIO", {
        type: ActivityType.Playing
    });
});

client.login(token);
