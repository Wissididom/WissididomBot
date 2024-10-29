import { MessageFlags, SlashCommandBuilder, User } from "discord.js";
import { getArgsFromMessage } from "../util.js";
import Logging from "../logging.js";

let exportObj = {
  name: "logging",
  description: "Manage your logging relationships",
  permissions: [],
  registerObject: () =>
    new SlashCommandBuilder()
      .setName(exportObj.name)
      .setDescription(exportObj.description)
      .addSubcommand((option) =>
        option
          .setName("add")
          .setDescription("Add a logging relationship")
          .addStringOption((option) =>
            option
              .setName("type")
              .setDescription("The type of logging you want to add")
              .setRequired(true)
              .setAutocomplete(true),
          )
          .addChannelOption((option) =>
            option
              .setName("target")
              .setDescription(
                "The target channel where the logging events should be posted",
              )
              .setRequired(true),
          )
          .addChannelOption((option) =>
            option
              .setName("source")
              .setDescription(
                "The source channel of the logging event if applicable",
              )
              .setRequired(false),
          ),
      )
      .addSubcommand((option) =>
        option
          .setName("remove")
          .setDescription("Remove a logging relationship")
          .addStringOption((option) =>
            option
              .setName("type")
              .setDescription("The type of logging you want to remove")
              .setRequired(true)
              .setAutocomplete(true),
          )
          .addChannelOption((option) =>
            option
              .setName("target")
              .setDescription(
                "The target channel where the logging events have been posted to",
              )
              .setRequired(true),
          )
          .addChannelOption((option) =>
            option
              .setName("source")
              .setDescription(
                "The source channel where the logging events have been posted from if applicable",
              )
              .setRequired(false),
          ),
      )
      .addSubcommand((option) =>
        option
          .setName("list")
          .setDescription("List your logging relationships"),
      ),
  runMessage: async (prefix, msg, db) => {
    if (msg.guild?.available) {
      let args = getArgsFromMessage(msg);
      if (args.length < 1) {
        await msg.reply({
          content: `Invalid amount of arguments! Usage: \`${prefix}logging <add|remove|list> [<type> <target> <source>]\``,
        });
        return;
      }
      let action = args[0].toLowerCase();
      if (!["add", "remove", "list"].includes(action)) {
        await msg.reply({
          content: `Invalid action (Only add, remove or list allowed)! Usage: \`${prefix}logging <add|remove|list> [<type> <target> <source>]\``,
        });
        return;
      }
      let type = args[1].toLowerCase();
      if (
        !Logging.availableLoggingEvents
          .map((str) => str.toLowerCase())
          .includes(type)
      ) {
        await msg.reply({
          content: `Invalid logging type! Usage: \`${prefix}logging <add|remove|list> [<type> <target> <source>]\``,
        });
        return;
      }
      let target = args[2];
      if (!/(?:<#\d+>|\d+)/g.test(target)) {
        await msg.reply({
          content: `Invalid target channel! Usage: \`${prefix}logging <add|remove|list> [<type> <target> <source>]\``,
        });
        return;
      }
      target = target.replace(/<#/g, "").replace(/>/g, "");
      let source = args[3];
      if (!source || !/(?:<#\d+>|\d+)/g.test(source)) {
        source = null;
      }
      source = source.replace(/<#/g, "").replace(/>/g, "");
      let loggings =
        action == "list"
          ? await db.getLoggings(msg.guildId)
          : await db.getLoggings(msg.guildId, type);
      let foundLoggings = [];
      if (loggings) {
        for (let logging of loggings) {
          if (action == "list") {
            foundLoggings.push(logging);
          } else {
            if (
              logging.sourceChannel == source &&
              logging.targetChannel == target
            ) {
              foundLoggings.push(logging);
            }
          }
        }
      }
      switch (action) {
        case "add":
          let updateResult = await db.setLogging(
            msg.guildId,
            type,
            source,
            target,
          );
          if (updateResult) {
            await msg.reply({
              content: `Successfully ${foundLoggings > 0 ? "updated" : "added"} ${type} events from <#${source}> to post to <#${target}>!`,
            });
          } else {
            await msg.reply({
              content: `Failed to ${foundLoggings > 0 ? "update" : "add"} ${type} events from <#${source}> to post to <#${target}>!`,
            });
          }
          break;
        case "remove":
          if (foundLoggings > 0) {
            let deleteResult = await db.setLogging(
              msg.guildId,
              type,
              source,
              target,
            );
            if (deleteResult) {
              await msg.reply({
                content: `Successfully deleted ${type} events from <#${source}> to post to <#${target}>!`,
              });
            } else {
              await msg.reply({
                content: `Failed to delete ${type} events from <#${source}> to post to <#${target}>!`,
              });
            }
          } else {
            await msg.reply({
              content: `There is no ${type} event from <#${source}> to post to <#${target}> that could be deleted!`,
            });
          }
          break;
        case "list":
          let loggingEntries = [];
          for (let logging of foundLoggings) {
            loggingEntries.push(
              `- ${logging.event} (<#${logging.sourceChannel}> -> <#${logging.targetChannel}>)`,
            );
          }
          if (loggingEntries > 0) {
            await msg.reply({
              content: `# There the following logging relationships setup for this server:\n${loggingEntries.join("\n")}`,
            });
          } else {
            await msg.reply({
              content:
                "There are no logging relationships that could be shown here!",
            });
          }
          break;
        default:
          // do nothing
          break;
      }
    }
  },
  runInteraction: async (interaction, db) => {
    if (interaction.guild?.available && interaction.isChatInputCommand()) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      let action = interaction.options.getSubcommand();
      let type = interaction.options.getString("type");
      let source = interaction.options.getChannel("source");
      let target = interaction.options.getChannel("target");
      let loggings =
        action == "list"
          ? await db.getLoggings(interaction.guildId)
          : await db.getLoggings(interaction.guildId, type);
      let foundLoggings = [];
      if (loggings) {
        for (let logging of loggings) {
          if (action == "list") {
            foundLoggings.push(logging);
          } else {
            if (
              logging.sourceChannel == source &&
              logging.targetChannel == target
            ) {
              foundLoggings.push(logging);
            }
          }
        }
      }
      switch (action) {
        case "add":
          let updateResult = await db.setLogging(
            interaction.guildId,
            type,
            source?.id,
            target.id,
          );
          if (updateResult) {
            await interaction.editReply({
              content: `Successfully ${foundLoggings > 0 ? "updated" : "added"} ${type} events from ${source ? `<#${source.id}>` : "every channel"} to post to <#${target.id}>!`,
            });
          } else {
            await interaction.editReply({
              content: `Failed to ${foundLoggings > 0 ? "update" : "add"} ${type} events from ${source ? `<#${source.id}>` : "every channel"} to post to <#${target.id}>!`,
            });
          }
          break;
        case "remove":
          if (foundLoggings.length > 0) {
            let deleteResult = await db.deleteLogging(
              interaction.guildId,
              type,
              source?.id,
              target.id,
            );
            if (deleteResult) {
              await interaction.editReply({
                content: `Successfully deleted ${type} events from ${source ? `<#${source.id}>` : "every channel"} to post to <#${target.id}>!`,
              });
            } else {
              await interaction.editReply({
                content: `Failed to delete ${type} events from ${source ? `<#${source.id}>` : "every channel"} to post to <#${target.id}>!`,
              });
            }
          } else {
            await interaction.editReply({
              content: `There is no ${type} event from ${source ? `<#${source.id}>` : "every channel"} to post to <#${target.id}> that could be deleted!`,
            });
          }
          break;
        case "list":
          let loggingEntries = [];
          for (let logging of foundLoggings) {
            loggingEntries.push(
              `- ${logging.event} (${logging.sourceChannel ? `<#${logging.sourceChannel}>` : "Every channel"} -> <#${logging.targetChannel}>)`,
            );
          }
          if (loggingEntries.length > 0) {
            await interaction.editReply({
              content: `# There are the following logging relationships setup for this server:\n${loggingEntries.join("\n")}`,
            });
          } else {
            await interaction.editReply({
              content:
                "There are no logging relationships that could be shown here!",
            });
          }
          break;
        default:
          // do nothing
          break;
      }
    }
  },
  runAutocomplete: async (interaction, db) => {
    let availableEvents = Logging.availableLoggingEvents.filter(
      (loggingEvent) => {
        return (
          loggingEvent
            .toLowerCase()
            .indexOf(
              interaction.options.getFocused().replace(" ", "_").toLowerCase(),
            ) >= 0
        );
      },
    );
    availableEvents.length = Math.min(availableEvents.length, 25); // send max. 25 choices
    await interaction
      .respond(
        availableEvents.map((loggingEvent) => {
          return {
            name: loggingEvent,
            value: loggingEvent,
          };
        }),
      )
      .catch((err) => console.error(err));
  },
};

export default exportObj;
