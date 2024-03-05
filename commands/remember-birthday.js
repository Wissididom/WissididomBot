import { PermissionsBitField, SlashCommandBuilder, Message } from "discord.js";
import { getArgsFromMessage } from "../util.js";

let exportObj = {
  name: "remember-birthday",
  description: "Saves your own birthday in the bot",
  permissions: [],
  registerObject: () =>
    new SlashCommandBuilder()
      .setName(exportObj.name)
      .setDescription(exportObj.description)
      .addStringOption((option) =>
        option
          .setName("date")
          .setDescription("The date your birthday is at")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("timezone")
          .setDescription(
            "Your timezone (used to send the birthday wishes when you're really celebrating birthday)",
          )
          .setRequired(false)
          .setAutocomplete(true),
      ),
  runMessage: async (prefix, msg, db) => {
    if (msg.guild?.available) {
      let args = getArgsFromMessage(msg);
      let birthdate = args[0];
      let timezone = args[1];
      if (!birthdate) {
        await msg.reply({
          content:
            "You must specify a birthday for this command! Format: `YYYY-MM-DD` (year optional)",
        });
        return;
      }
      let dateRegex = /(?:(\d{4})-)?(\d{1,2})-(\d{1,2})/g;
      let dateMatch = dateRegex.exec(birthdate);
      if (!dateMatch) {
        await msg.reply({
          content:
            "You must specify a valid birthday for this command! Format: `YYYY-MM-DD` (year optional)",
        });
        return;
      }
      let year = dateMatch[1];
      let month = dateMatch[2];
      let day = dateMatch[3];
      let result = await db.setBirthday(
        msg.guildId,
        msg.author.id,
        year,
        month,
        day,
        timezone,
      );
      if (result) {
        await msg.reply({
          content: `Successfully saved <@${msg.author.id}>'s birthday of \`${birthdate}\`!`,
        });
      } else {
        await msg.reply({
          content: `Failed to save <@${msg.author.id}>'s birthday of \`${birthdate}\`!`,
        });
      }
    }
  },
  runInteraction: async (interaction, db) => {
    if (interaction.guild?.available && interaction.isChatInputCommand()) {
      let birthdate = interaction.options.getString("date");
      let timezone = interaction.options.getString("timezone");
      if (!birthdate) {
        await interaction.reply({
          content: `You must specify a birthday! Format: \`YYYY-MM-DD\` (year optional)`,
        });
        return;
      }
      let dateRegex = /(?:(\d{4})-)?(\d{1,2})-(\d{1,2})/g;
      let dateMatch = dateRegex.exec(birthdate);
      if (!dateMatch) {
        await msg.reply({
          content:
            "You must specify a valid birthday for this command! Format: `YYYY-MM-DD` (year optional)",
        });
        return;
      }
      let year = dateMatch[1];
      let month = dateMatch[2];
      let day = dateMatch[3];
      let result = await db.setBirthday(
        interaction.guildId,
        interaction.user.id,
        year,
        month,
        day,
        timezone,
      );
      if (result) {
        await interaction.reply({
          content: `Successfully saved <@${interaction.user.id}>'s birthday of \`${birthdate}\`!`,
        });
      } else {
        await interaction.reply({
          content: `Failed to save <@${interaction.user.id}>'s birthday of \`${birthdate}\`!`,
        });
      }
    }
  },
};

export default exportObj;
