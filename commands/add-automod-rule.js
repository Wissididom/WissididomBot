const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "add-automod-rule",
  description: "Adds an automod rule to the current server",
  permissions: [
    PermissionsBitField.Flags.Administrator,
    PermissionsBitField.Flags.ManageGuild,
  ],
  runMessage: async (msg) => {
    // TODO
  },
  runInteraction: async (interaction) => {
    // TODO
  },
};
