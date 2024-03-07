import { SlashCommandBuilder, User } from "discord.js";
import { getArgsFromMessage } from "../util.js";

let exportObj = {
  name: "birthday",
  description: "Gets your or someone elses birthday from the bot",
  permissions: [],
  registerObject: () =>
    new SlashCommandBuilder()
      .setName(exportObj.name)
      .setDescription(exportObj.description)
      .addUserOption((option) =>
        option
          .setName("member")
          .setDescription("The member whose birthday you want to see")
          .setRequired(false),
      ),
  runMessage: async (prefix, msg, db) => {
    if (msg.guild?.available) {
      let args = getArgsFromMessage(msg);
      let member = args[0];
      if (!member || member == "") {
        member = msg.author.id;
      } else {
        let memberRegex = /(?:<@!?(\d+)>|(\d+))/g;
        let memberMatch = memberRegex.exec(member);
        if (memberMatch) {
          member =
            memberMatch[1] && memberMatch[1].trim().length > 0
              ? memberMatch[1]
              : memberMatch[2];
        } else {
          await msg.reply({
            content:
              "You must specify a valid member, if you want to specify a member (Either mention or use their ID)",
          });
          return;
        }
      }
      let birthday = await db.getBirthday(msg.guildId, member);
      if (birthday) {
        await msg.reply({
          content: `<@${msg.author.id}>'s birthday is \`${birthday.year}-${birthday.month}-${birthday.day}\` (${birthday.timezone})!`,
        });
      } else {
        await msg.reply({
          content: `Failed to get <@${msg.author.id}>'s birthday!`,
        });
      }
    }
  },
  runInteraction: async (interaction, db) => {
    if (interaction.guild?.available && interaction.isChatInputCommand()) {
      let member = interaction.options.getUser("member")?.id;
      if (!member) {
        member = interaction.user.id;
      }
      let birthday = await db.getBirthday(
        interaction.guildId,
        member instanceof User ? member.id : member,
      );
      if (birthday) {
        await interaction.reply({
          content: `<@${member}>'s birthday is \`${birthday.year}-${birthday.month}-${birthday.day}\` (${birthday.timezone})!`,
          allowed_mentions: { parse: [] }, // Prevent pings of other people
        });
      } else {
        await interaction.reply({
          content: `Failed to get <@${member}>'s birthday!`,
          allowed_mentions: { parse: [] }, // Prevent pings of other people
        });
      }
    }
  },
  runAutocomplete: async (interaction, db) => {
    // Not necessary
  },
};

export default exportObj;
