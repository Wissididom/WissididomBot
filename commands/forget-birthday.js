import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

let exportObj = {
  name: "forget-birthday",
  description: "Deletes your own birthday from the bot",
  permissions: [],
  registerObject: () =>
    new SlashCommandBuilder()
      .setName(exportObj.name)
      .setDescription(exportObj.description),
  runMessage: async (prefix, msg, db) => {
    if (msg.guild?.available) {
      let result = await db.deleteBirthday(msg.guildId, msg.author.id);
      if (result && result > 0) {
        await msg.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle("Deleted birthday")
              .setDescription(
                `Successfully deleted <@${msg.author.id}>'s birthday!`,
              ),
          ],
        });
      } else {
        await msg.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle("Failed to delete birthday")
              .setDescription(
                `Failed to delete <@${msg.author.id}>'s birthday!`,
              ),
          ],
        });
      }
    }
  },
  runInteraction: async (interaction, db) => {
    if (interaction.guild?.available && interaction.isChatInputCommand()) {
      await interaction.deferReply();
      let result = await db.deleteBirthday(
        interaction.guildId,
        interaction.user.id,
      );
      if (result) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle("Deleted birthday")
              .setDescription(
                `Successfully deleted <@${interaction.user.id}>'s birthday!`,
              ),
          ],
        });
      } else {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle("Failed to delete birthday")
              .setDescription(
                `Failed to delete <@${interaction.user.id}>'s birthday!`,
              ),
          ],
        });
      }
    }
  },
  runAutocomplete: async (interaction, db) => {
    // Not necessary
  },
};

export default exportObj;
