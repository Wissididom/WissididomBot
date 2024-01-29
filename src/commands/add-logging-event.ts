import {
  PermissionsBitField,
  SlashCommandBuilder,
  Message,
  Interaction,
  ChannelType,
  EmbedBuilder,
} from "discord.js";
import { getComplexArgsFromMessage } from "../util";
import Database from "../database/mariadb";

let exportObj = {
  name: "add-logging-event",
  description:
    "Adds an event, source channel and destination channel for logging",
  permissions: [
    PermissionsBitField.Flags.Administrator,
    PermissionsBitField.Flags.ManageGuild,
  ],
  registerObject: () =>
    new SlashCommandBuilder()
      .setName(exportObj.name)
      .setDescription(exportObj.description)
      .addStringOption((option) =>
        option
          .setName("event")
          .setDescription("The name of the event to add")
          .setRequired(true)
          .setChoices({
            name: "Message Update",
            value: "messageUpdate",
          }),
      )
      .addChannelOption(
        (option) =>
          option
            .setName("destination")
            .setDescription("The channel in which the event should be logged")
            .setRequired(true)
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildVoice,
              ChannelType.GuildAnnouncement,
              ChannelType.AnnouncementThread,
              ChannelType.PublicThread,
              ChannelType.PrivateThread,
              ChannelType.GuildStageVoice,
            ), // Everything except CategoryChannels, ForumChannels and MediaChannels
      )
      .addChannelOption(
        (option) =>
          option
            .setName("source")
            .setDescription(
              "The channel the event originated from (if applicable)",
            )
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildVoice,
              ChannelType.GuildAnnouncement,
              ChannelType.AnnouncementThread,
              ChannelType.PublicThread,
              ChannelType.PrivateThread,
              ChannelType.GuildStageVoice,
            ), // Everything except CategoryChannels, ForumChannels and MediaChannels
      ),
  runMessage: async (prefix: string, msg: Message) => {
    if (msg.guild?.available) {
      let args: { [key: string]: string } | null =
        getComplexArgsFromMessage(msg);
      if (!args) {
        await msg.reply({
          content: "You must specify args for this command!",
        });
        return;
      }
      let event = args.event;
      if (!event) {
        await msg.reply({
          content: "You must specify an event for this logging connection!",
        });
        return;
      }
      let sourceChannel = args.source; // null means there is either no channel connection or it should be affecting all channels
      let destinationChannel = args.triggertype;
      if (!destinationChannel) {
        await msg.reply({
          content:
            "You must specify an destination channel for this logging connection!",
        });
        return;
      }
      let success = true; // TODO: Write to database
      if (success) {
        await msg.reply({
          content: "Successfully created or updated this logging connection!",
        });
      } else {
        await msg.reply({
          content: "Could't create or update this logging connection!",
        });
      }
    }
  },
  runInteraction: async (interaction: Interaction) => {
    if (interaction.guild?.available && interaction.isChatInputCommand()) {
      await interaction.deferReply({ ephemeral: true });
      let event = interaction.options.getString("event");
      if (!event) {
        await interaction.editReply({
          content: "You must specify an event for this logging connection!",
        });
        return;
      }
      let sourceChannel = interaction.options.getChannel("source"); // null means there is either no channel connection or it should be affecting all channels
      let destinationChannel = interaction.options.getChannel("destination");
      if (!destinationChannel) {
        await interaction.editReply({
          content:
            "You must specify an destination channel for this logging connection!",
        });
        return;
      }
      if (interaction.guildId && destinationChannel) {
        let currentLoggings = await Database.getLoggings(interaction.guildId);
        let alreadyExists = false;
        for (let currentLogging of currentLoggings) {
          if (
            currentLogging.serverId == interaction.guildId &&
            currentLogging.event == event &&
            currentLogging.sourceChannel == sourceChannel?.id &&
            currentLogging.destinationChannel == destinationChannel.id
          ) {
            alreadyExists = true;
            break;
          }
        }
        if (alreadyExists) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Failed to create logging connection")
                .setDescription("This logging connection already exists!"),
            ],
          });
        } else {
          await Database.addLogging({
            serverId: interaction.guildId,
            event,
            sourceChannel: sourceChannel?.id ?? null,
            destinationChannel: destinationChannel.id,
          });
        }
        await interaction.editReply({
          content: "Successfully created or updated this logging connection!",
        });
      } else {
        await interaction.editReply({
          content: "Could't create or update this logging connection!",
        });
      }
    }
  },
};

export default exportObj;
