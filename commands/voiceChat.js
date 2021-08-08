const Enmap = require(`enmap`);

module.exports = {
    data: [{
        name: `voice-chat`,
        description: `Creates a new voice chat with the given name and user count`,
        options:[
            {
                type: `STRING`,
                name: "name",
                description: "The name of the voice channel you want created",
                required: true
            },
            {
                type: `INTEGER`, 
                name: "number",
                description: "The number of people you want to allow in the voice channel",
                required: false
            }
        ]
    }],
    async execute(interaction){
        const db = await require(`../database.js`);
        if(!interaction.inGuild()){
            return interaction.reply(`You need to do this in a server, not a private message.`, {ephemeral: true});
        }
        interaction.guild.channels.create(interaction.options.get(`name`).value, {userLimit: interaction.options.get(`number`)?.value || 0, type: `GUILD_VOICE`, parent: interaction.guild.channels.cache.get(db.getCategory(interaction.guildId))})
            .then(chan => checkNumbers(chan))
            .catch(error => console.log(`Error: ${error}`));
        return interaction.reply({content: `Created a new voice channel called **${interaction.options.get(`name`).value}**.
Please do not create more than 1 voice channel at a time.
When everyone has left the VC, it will be deleted within **${db.getTime(interaction.guildId)} seconds**.`, ephemeral: true});
    },
}

function checkNumbers(channel){
    deleteChan = setTimeout(deleteChannel, db.getTime(interaction.guildId)*1000, channel);
}

function deleteChannel(channel){
    if(channel.deleted){
        return;
    }
    if(channel.members.size < 1){
        channel.delete();
        return;
    }
    checkNumbers(channel);
}
