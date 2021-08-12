module.exports = {
    data: [{
        name: `config`,
        description: `Configures the VC-Manager's settings. TEST`,
        options:[
            {
                type: `CHANNEL`,
                name: `category`,
                description: `The category you want new voice channels created under.`,
            },
            {
                type: `INTEGER`, 
                name: `time`,
                description: `The time in seconds before a voice channel is deleted.`,
            },
            {
                type: `ROLE`,
                name: `role`,
                description: `The role you want users to have before they can create a voice channel.`,
            }
        ]
    }],
    async execute(interaction){
        if(!interaction.inGuild()){
            return interaction.reply({ content: `You need to do this in a server, not a private message.`, ephemeral: true});
        }
        if(!interaction.member.permissions.has(`MANAGE_GUILD`)){
            interaction.reply({ content: `You need the Manage Guild permission to use this command.`, ephemeral: true});
            return;
        }
        if(interaction.options.data.length === 0){
            return interaction.reply({content: `Here are your current server settings:\nCategory: ${interaction.guild.channels.cache.get(interaction.client.config.get(interaction.guild.id.toString()).category)}\nTime: ${interaction.client.config.get(interaction.guild.id.toString()).time}\nRole: ${interaction.guild.roles.cache.get(interaction.client.config.get(interaction.guild.id.toString()).role)}`, ephemeral: true});
        }
        for(option of interaction.options.data){
            interaction.client.config.set(interaction.guildId.toString(), option.value.toString(), option.name);
        }
        return interaction.reply({content: `Updated your current server settings:\nCategory: ${interaction.guild.channels.cache.get(interaction.client.config.get(interaction.guild.id.toString()).category)}\nTime: ${interaction.client.config.get(interaction.guild.id.toString()).time}\nRole: ${interaction.guild.roles.cache.get(interaction.client.config.get(interaction.guild.id.toString()).role)}`, ephemeral: true});
    },
}
