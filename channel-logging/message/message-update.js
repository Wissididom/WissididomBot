const { Message, EmbedBuilder } = require("discord.js");
const { Database } = require("../../database/mariadb");

/**
 * Emitted whenever a message is updated - e.g. embed or content change.
 * @param {Message} oldMessage The message before the update
 * @param {Message} newMessage The message after the update
 */
async function messageUpdate(oldMessage, newMessage) {
  let serverId = newMessage.guildId;
  let loggings = await Database.getLoggings(serverId);
  let oldMessageContent = oldMessage.content;
  if (oldMessageContent.length > 1024)
    oldMessageContent.substring(0, 1020) + "...";
  let newMessageContent = newMessage.content;
  if (newMessageContent.length > 1024)
    newMessageContent.substring(0, 1020) + "...";
  for (let logging of loggings) {
    if (logging.event == "messageUpdate") {
      if (newMessage.channelId == logging.sourceChannel) {
        let destinationChannel = await newMessage.client.channels.fetch(
          logging.destinationChannel,
        );
        if (destinationChannel) {
          await destinationChannel.send({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `Message Edited in <#${newMessage.channelId}> [Jump to Message](<${newMessage.url}>)`,
                )
                .addFields(
                  {
                    name: "Before:",
                    value: oldMessageContent,
                  },
                  {
                    name: "After:",
                    value: newMessageContent,
                  },
                )
                .setAuthor({
                  name: newMessage.author.username,
                  iconURL: newMessage.author.displayAvatarURL(),
                })
                .setTimestamp(),
            ],
          });
        }
      }
    }
  }
}

module.exports.messageUpdate = messageUpdate;
