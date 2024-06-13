import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getArgsFromMessage } from "../util.js";

const SUPPORTED_TIMEZONES = Intl.supportedValuesOf("timeZone");

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
      if (!timezone) timezone = await db.getTimezone(msg.guildId);
      if (!birthdate) {
        await msg.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle("Failed to set birthday")
              .setDescription(
                `You must specify a birthday! Format: \`YYYY-MM-DD\` (year optional)`,
              ),
          ],
        });
        return;
      }
      let dateRegex = /(?:(\d{4})-)?(\d{1,2})-(\d{1,2})/g;
      let dateMatch = dateRegex.exec(birthdate);
      if (!dateMatch) {
        await msg.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle("Failed to set birthday")
              .setDescription(
                "You must specify a valid birthday for this command! Format: `YYYY-MM-DD` (year optional)",
              ),
          ],
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
          embeds: [
            new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle("Saved birthday")
              .setDescription(
                `Successfully saved <@${interaction.user.id}>'s birthday of \`${birthdate}\` (\`${timezone}\`)!`,
              ),
          ],
        });
      } else {
        await msg.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle("Failed to set birthday")
              .setDescription(
                `Failed to save <@${interaction.user.id}>'s birthday of \`${birthdate}\` (\`${timezone}\`)!`,
              ),
          ],
        });
      }
    }
  },
  runInteraction: async (interaction, db) => {
    if (interaction.guild?.available && interaction.isChatInputCommand()) {
      await interaction.deferReply();
      let birthdate = interaction.options.getString("date");
      let timezone = interaction.options.getString("timezone");
      if (!timezone) timezone = await db.getTimezone(interaction.guildId);
      if (!birthdate) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle("Failed to set birthday")
              .setDescription(
                `You must specify a birthday! Format: \`YYYY-MM-DD\` (year optional)`,
              ),
          ],
        });
        return;
      }
      let dateRegex = /(?:(\d{4})-)?(\d{1,2})-(\d{1,2})/g;
      let dateMatch = dateRegex.exec(birthdate);
      if (!dateMatch) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle("Failed to set birthday")
              .setDescription(
                "You must specify a valid birthday for this command! Format: `YYYY-MM-DD` (year optional)",
              ),
          ],
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
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle("Saved birthday")
              .setDescription(
                `Successfully saved <@${interaction.user.id}>'s birthday of \`${birthdate}\` (\`${timezone}\`)!`,
              ),
          ],
        });
      } else {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle("Failed to set birthday")
              .setDescription(
                `Failed to save <@${interaction.user.id}>'s birthday of \`${birthdate}\` (\`${timezone}\`)!`,
              ),
          ],
        });
      }
    }
  },
  runAutocomplete: async (interaction, db) => {
    if (interaction.guild?.available && interaction.isAutocomplete()) {
      let timezoneResponse = SUPPORTED_TIMEZONES.filter((zone) => {
        return (
          zone
            .toLowerCase()
            .indexOf(
              interaction.options.getFocused().replace(" ", "_").toLowerCase(),
            ) >= 0
        );
      });
      timezoneResponse.length = Math.min(timezoneResponse.length, 25); // send max. 25 choices
      await interaction
        .respond(
          timezoneResponse.map((zone) => {
            return {
              name: zone,
              value: zone,
            };
          }),
        )
        .catch((err) => console.error(JSON.stringify(err)));
    }
  },
};

export default exportObj;
