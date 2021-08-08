const Enmap = require(`enmap`);

const defaultConfig = {
    category: "",
    time: "60",
    role: "",
}

module.exports = {
    config: new Enmap({
        name: `config`,
        fetchAll: true,
        autoFetch: true,
        cloneLevel: `deep`,
        autoEnsure: defaultConfig,
        ensureProps: true
    }),
    getCategory: (guild) => {
        return this.config.get(guild, `category`);
    },
    getTime: (guild) => {
        return this.config.get(guild, `time`);
    },
    getRole: (guild) => {
        return this.config.get(guild, `role`);
    },
}
