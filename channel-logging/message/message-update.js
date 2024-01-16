import { EmbedBuilder } from "discord.js";
import { Database } from "../../database/mariadb.js";

export async function messageUpdate(oldMessage, newMessage) {
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
                .setTitle(
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
