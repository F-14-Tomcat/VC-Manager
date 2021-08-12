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
        if(!interaction.inGuild()){
            interaction.reply({ content: `You need to do this in a server, not a private message.`, ephemeral: true});
            return;
        }
        if(!interaction.member.roles.cache.get(interaction.client.config.get(interaction.guildId).role)){
            interaction.reply({ content: `You need the ${interaction.guild.roles.cache.get(interaction.client.config.get(interaction.guild.id.toString()).role)} role to use this command.`, ephemeral: true});
            return;
        }
        if(interaction.options.get(`number`)?.value > 99 || interaction.options.get(`number`)?.value < 1){
            interaction.reply({ content: `The number of people allowed in the voice channel must be between 1 and 99.`, ephemeral: true});
            return;
        }
        interaction.guild.channels.create(interaction.options.get(`name`).value, {userLimit: interaction.options.get(`number`)?.value || 0, type: `GUILD_VOICE`, parent: interaction.client.config.get(interaction.guildId.toString())?.category})
            .then(chan => checkNumbers(chan, interaction))
            .catch(error => console.log(`Error: ${error}`));
        interaction.reply({content: `Created a new voice channel called **${interaction.options.get(`name`).value}**.
Please do not create more than 1 voice channel at a time.
When everyone has left the VC, it will be deleted within **${interaction.client.config.get(interaction.guild.id.toString()).time} seconds**.`, ephemeral: true});
        return;
    },
}

function checkNumbers(channel, interaction){
    deleteChan = setTimeout(deleteChannel, interaction.client.config.get(interaction.guildId).time*1000, channel, interaction);
}

function deleteChannel(channel, interaction){
    if(channel.deleted){
        return;
    }
    if(channel.members.size < 1){
        channel.delete();
        return;
    }
    checkNumbers(channel, interaction);
}
