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
        const db = await require(`../database.js`);
        if(!interaction.inGuild()){
            return interaction.reply(`You need to do this in a server, not a private message.`, {ephemeral: true});
        }
        console.log(db.getTime(interaction.guildId))
        if(interaction.options.data.length === 0){
            return interaction.reply(`Here are your current server settings:\nCategory: ${db.getCategory(interaction.guildId)}\nTime: ${db.getTime(interaction.guildId)}\nRole: ${db.getTime(interaction.guildId)}`, {ephemeral: true});
        }
        for(option in interaction.options.data){
            db.config.set(interaction.guild.toString(), option.value, option.name);
        }
        return interaction.reply(`Updated your current server settings:\nCategory: ${db.getCategory(interaction.guildId)}\nTime: ${db.getTime(interaction.guildId)}\nRole: ${db.getTime(interaction.guildId)}`, {ephemeral: true});
    },
}
