require('dotenv').config();

const {REST} = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection } = require('discord.js');
const { Player } = require("discord-player")
const {get} = require("snekfetch");
const PREFIX = "/";

const fs = require('fs');
const path = require('path');
const { url } = require('inspector');


const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});

// List of all commands
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands"); // E:\yt\discord bot\js\intro\commands
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for(const file of commandFiles)
{
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// Add the player on the client
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

client.on("ready", () => {
    // Get all ids of the servers
    const guild_ids = client.guilds.cache.map(guild => guild.id);


    const rest = new REST({version: '9'}).setToken(process.env.TOKEN);
    for (const guildId of guild_ids)
    {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), 
            {body: commands})
        .then(() => console.log('Successfully updated commands for guild ' + guildId))
        .catch(console.error);
    }
});

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try
    {
        await command.execute({client, interaction});
    }
    catch(error)
    {
        console.error(error);
        await interaction.reply({content: "There was an error executing this command"});
    }
});

const random_greet = () => {
    return Math.floor(Math.random() * 4);
}

const random_goodnight = () => {
    return Math.floor(Math.random() * 2);
}

const random_okayu = () => {
    return Math.floor(Math.random() * 16);
}

const random_niwat = () => {
    return Math.floor(Math.random() * 6);
}

const dice = () => {
    return Math.floor(Math.random() * 6);
}

client.on('ready', () => {
    console.log('Niwat ma laew krub')
})

client.on('messageCreate', msg => {
    let greet = ['สวัสดีครับ', 'ว่าไงครับ', 'ครับผม', 'วันนี้อากาศดีนะครับ']
    if (msg.content == 'สวัสดีคุณนิวัตรครับ'||msg.content == 'สวัสดีคุณนิวัตรค่ะ') {
        msg.reply(greet[random_greet()])
    }
    if (msg.content == 'ทอยลูกเต๋ากันครับ'||msg.content == 'ทอยลูกเต๋ากันค่ะ') {
        msg.channel.send('คุณได้ ' + String(dice() + 1) + ' ครับ')
    }
    let goodnight = ['ฝันดีครับ', 'ราตรีสวัสดิ์ครับ']
    if (msg.content == 'ฝันดีคุณนิวัตรครับ'||msg.content == 'ฝันดีคุณนิวัตรค่ะ') {
        msg.reply(goodnight[random_goodnight()])
    }
})

client.on('message', message => {
    if (message.content.startsWith(PREFIX + 'cat')) {
        try {
            get('https://aws.random.cat/meow').then(response => {
                    message.reply({files: [{attachment: response.body.file, name: `cat.${response.body.file.split('.')[4]}`}]
                });
                    console.log('random cat picture');
                    })
                    } catch (e) {
                         console.log('error!');
                         }
    }
})

client.on('message', message => {
    if (message.content.startsWith(PREFIX + 'okayu')) {
        message.reply({files: ['images\\okayu\\'+String(random_okayu())+'.gif']})
        console.log('random okayu picture')
    }
})

client.on('message', message => {
    if (message.content.startsWith(PREFIX + 'niwatt')) {
        let niwat = ['002.jpg','28082563_04.jpg','215795952_4046343355415001_7383805107897911265_n.jpg','Niwat.jpg'
                    ,'Screenshot 2022-07-11 152108.png','Screenshot 2022-07-11 152149.png']
        message.reply({files: ['images\\'+'niwat\\'+niwat[random_niwat()]]})
        console.log('random niwat picture')
    }
})

client.login(process.env.TOKEN);