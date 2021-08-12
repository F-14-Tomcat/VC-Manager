const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.data[0].name, command);
}

const Enmap = require(`enmap`);

const defaultConfig = {
    category: "default",
    time: "60",
    role: "default",
}

client.config = new Enmap({
    name: `config`,
    fetchAll: true,
    autoFetch: true,
    cloneLevel: `deep`,
    autoEnsure: {
        category: undefined,
        time: "60",
        role: undefined,
    }
});

client.once('ready', async () => {
    console.log('Ready!');

    console.log(`\nDeleting old global commands:`);
    for(command of client.application?.commands.cache){
        if(!client.commands.has(command.name)){
            client.application?.commands.delete(command.id)
            console.log(`\t${command.name}`)
        }
    }

    console.log(`\nLoading new global commands:`);
    for(command of client.commands){
        try{
            await client.application?.commands.create(command[1].data[0]);
            console.log(`\t${command[1].data[0].name}`)
        }catch(error){
            console.log(`${error}\n${command[1].data[0].name} not loaded`)
        }
    }
});

client.on('interactionCreate', async interaction => {
    if(interaction.isCommand()){
        if(!client.commands.has(interaction.commandName)) return;
        try{
            await client.commands.get(interaction.commandName).execute(interaction);
        }catch (error){
            console.error(error);
            return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.login(token);
